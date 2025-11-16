<template>
  <div class="user-table-container">
    <!-- Хедер с действиями -->
    <TableHeader
      :title="title"
      :filtered-and-searched-users-length="filteredAndSearchedUsers.length"
      :selected-users-length="selectedUsers.length"
      :is-loading="isLoading"
      :show-all-users="showAllUsers"
      @click-add-user-modal="openAddUserModal"
      @click-export-to-csv="exportToCSV"
      @click-delete-selected-users="deleteSelectedUsers"
      @update:search-query="updateSearchQuery"
      @update:filter-role="updateFilterRole"
    />
    <!-- Фильтры -->
    <TableFilters
      :filter-buttons="[
        { name: '', value: 'Все' },
        { name: 'active', value: 'Активные' },
        { name: 'inactive', value: 'Неактивные' },
      ]"
      :dateFrom="dateFrom"
      :dateTo="dateTo"
      :filter-status="filterStatus"
      @click-filter-status="updateFilterStatus"
      @input-date-from="updateInputDateFrom"
      @input-date-to="updateInputDateTo"
      @clear-all-input-date="clearDateFilter"
    />
    <!-- Загрузка -->
    <UILoader :show-loader="isLoading" />
    <!-- Ошибка -->
    <UIError :show-error="error" @click-retry-load="retryLoad" />
    <!-- Таблица -->
    <div v-if="!isLoading && !error" class="table-wrapper">
      <TableList
        :paginated-users="paginatedUsers"
        :selected-users="selectedUsers"
        :editing-user-id="editingUserId"
        :edit-form="editForm"
        :sort-column="sortColumn"
        :sort-direction="sortDirection"
        :is-all-selected="isAllSelected"
        @toggle-select-user="toggleSelectUser"
        @toggle-select-all="toggleSelectAll"
        @sort-by="sortBy"
        @start-edit="startEdit"
        @save-edit="saveEdit"
        @cancel-edit="cancelEdit"
        @open-user-details="openUserDetails"
        @delete-user="deleteUser"
        @toggle-user-status="toggleUserStatus"
        @clear-all-filters="clearAllFilters"
      />
    </div>
    <!-- Пагинация -->
    <TableFooter
      v-if="!isLoading"
      :current-page="currentPage"
      :page-size="pageSize"
      :total-items="filteredAndSearchedUsers.length"
      @update:current-page="updateCurrentPage"
      @update:page-size="updatePageSize"
    />
    <!-- Модальное окно добавления пользователя -->
    <ModalAddUser
      :show-modal="showAddUserModal"
      :users="users"
      :is-saving="isSaving"
      @close-modal="closeAddUserModal"
      @click-add-new-user="addNewUser($event)"
    />
    <!-- Модальное окно деталей пользователя -->
    <ModalDetailsUser
      :show-details-modal="showDetailsModal"
      :selected-user="selectedUser"
      @close-modal="closeDetailsModal"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import type { User, AddUserForm } from '../types.ts';
  import { formatDate, getRoleLabel } from '../utils.ts';
  import TableHeader from './TableHeader.vue';
  import TableFilters from './TableFilters.vue';
  import UILoader from './ui/UILoader.vue';
  import UIError from './ui/UIError.vue';
  import ModalAddUser from './ModalAddUser.vue';
  import ModalDetailsUser from './ModalDetailsUser.vue';
  import TableFooter from './TableFooter.vue';
  import TableList from './TableList.vue';

  interface Props {
    title?: string;
    initialPageSize?: number;
    apiEndpoint?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: 'Управление пользователями',
    initialPageSize: 25,
    apiEndpoint: '/api/users',
  });

  const users = ref<User[]>([]);
  const isLoading = ref<boolean>(false);
  const isSaving = ref<boolean>(false);
  const error = ref<string | null>(null);
  const searchQuery = ref<string>('');
  const filterRole = ref<string>('');
  const filterStatus = ref<string>('');
  const dateFrom = ref<string>('');
  const dateTo = ref<string>('');
  const sortColumn = ref<keyof User>('id');
  const sortDirection = ref<'asc' | 'desc'>('asc');
  const currentPage = ref<number>(1);
  const pageSize = ref<number>(props.initialPageSize);
  const selectedUsers = ref<number[]>([]);
  const showAllUsers = ref<boolean>(false);
  const editingUserId = ref<number | null>(null);
  const editForm = ref({ name: '', email: '', role: '' });
  const showAddUserModal = ref<boolean>(false);
  const showDetailsModal = ref<boolean>(false);
  const selectedUser = ref<User | null>(null);

  const roleFilteredUsers = computed(() => {
    if (!filterRole.value) return users.value;
    return users.value.filter(u => u.role === filterRole.value);
  });

  const statusFilteredUsers = computed(() => {
    if (!filterStatus.value) return roleFilteredUsers.value;
    return roleFilteredUsers.value.filter(u => u.status === filterStatus.value);
  });

  const dateFilteredUsers = computed(() => {
    let filtered = statusFilteredUsers.value;

    if (dateFrom.value) {
      const fromDate = new Date(dateFrom.value);
      filtered = filtered.filter(u => new Date(u.registrationDate) >= fromDate);
    }

    if (dateTo.value) {
      const toDate = new Date(dateTo.value);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(u => new Date(u.registrationDate) <= toDate);
    }

    return filtered;
  });

  const filteredAndSearchedUsers = computed(() => {
    if (!searchQuery.value?.trim()) return dateFilteredUsers.value;

    const q = searchQuery.value.toLowerCase().trim();
    return dateFilteredUsers.value.filter(
      u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toString().includes(q)
    );
  });

  const sortedUsers = computed(() => {
    const usersArray = [...filteredAndSearchedUsers.value];
    usersArray.sort((a, b) => {
      let aVal: string | number | null = a[sortColumn.value];
      let bVal: string | number | null = b[sortColumn.value];
      if (sortColumn.value === 'registrationDate' || sortColumn.value === 'lastActivity') {
        const aDate = aVal ? new Date(aVal).getTime() : 0;
        const bDate = bVal ? new Date(bVal).getTime() : 0;
        aVal = aDate;
        bVal = bDate;
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      } else if (aVal === null && bVal === null) {
        return 0;
      } else if (aVal === null) {
        return sortDirection.value === 'asc' ? -1 : 1;
      } else if (bVal === null) {
        return sortDirection.value === 'asc' ? 1 : -1;
      }
      if (aVal < bVal) {
        return sortDirection.value === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortDirection.value === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return usersArray;
  });

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sortedUsers.value.slice(start, end);
  });

  const isAllSelected = computed(() => {
    return (
      paginatedUsers.value.length > 0 &&
      paginatedUsers.value.every(user => selectedUsers.value.includes(user.id))
    );
  });

  watch([searchQuery, filterRole, filterStatus, dateFrom, dateTo, pageSize], () => {
    currentPage.value = 1;
  });

  const loadUsers = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      users.value = generateMockUsers(100);
    } catch (err) {
      error.value = 'Ошибка загрузки данных: ' + (err as Error).message;
    } finally {
      isLoading.value = false;
    }
  };

  const retryLoad = async () => {
    await loadUsers();
  };

  const updateSearchQuery = (event: string) => {
    searchQuery.value = String(event).trim();
  };

  const updateFilterRole = (event: string) => {
    filterRole.value = String(event).trim();
  };

  const updateFilterStatus = (event: string) => {
    filterStatus.value = event;
  };

  const updateInputDateFrom = (event: string) => {
    dateFrom.value = event;
  };

  const updateInputDateTo = (event: string) => {
    dateTo.value = event;
  };

  const updateCurrentPage = (page: number) => {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updatePageSize = (event: string | number) => {
    const size = Number(event);
    pageSize.value = size;
    currentPage.value = 1;
  };

  const generateMockUsers = (count: number): User[] => {
    const roles: User['role'][] = ['admin', 'user', 'moderator'];
    const statuses: User['status'][] = ['active', 'inactive'];
    const names = [
      'Иван Петров',
      'Мария Сидорова',
      'Алексей Иванов',
      'Елена Кузнецова',
      'Дмитрий Смирнов',
      'Ольга Попова',
      'Сергей Васильев',
      'Анна Соколова',
      'Николай Михайлов',
      'Татьяна Новикова',
    ];
    const users: User[] = [];
    for (let i = 1; i <= count; i++) {
      const name = names[Math.floor(Math.random() * names.length)] + ' ' + i;
      const registrationDate = new Date(
        2025,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28)
      );
      const lastActivity = new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      );
      const roleIndex = Math.floor(Math.random() * roles.length);
      const statusIndex = Math.floor(Math.random() * statuses.length);
      const user: User = {
        id: i,
        name: name,
        email: `user${i}@example.com`,
        role: roles[roleIndex]!,
        status: statuses[statusIndex]!,
        registrationDate: registrationDate.toISOString(),
        lastActivity: lastActivity.toISOString(),
        avatar: null,
        loginCount: Math.floor(Math.random() * 500),
        postsCount: Math.floor(Math.random() * 100),
        commentsCount: Math.floor(Math.random() * 300),
      };
      users.push(user);
    }
    return users;
  };

  const sortBy = (column: keyof User) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortDirection.value = 'asc';
    }
  };

  const toggleSelectUser = (userId: number) => {
    const index = selectedUsers.value.indexOf(userId);
    if (index > -1) {
      selectedUsers.value.splice(index, 1);
    } else {
      selectedUsers.value.push(userId);
    }
  };

  const toggleSelectAll = () => {
    if (isAllSelected.value) {
      selectedUsers.value = selectedUsers.value.filter(
        id => !paginatedUsers.value.some(user => user.id === id)
      );
    } else {
      paginatedUsers.value.forEach(user => {
        if (!selectedUsers.value.includes(user.id)) {
          selectedUsers.value.push(user.id);
        }
      });
    }
  };

  const startEdit = (user: User) => {
    editingUserId.value = user.id;
    editForm.value = {
      name: user.name,
      email: user.email,
      role: user.role,
    };
  };

  const cancelEdit = () => {
    editingUserId.value = null;
    editForm.value = { name: '', email: '', role: '' };
  };

  const saveEdit = async (userId: number) => {
    isSaving.value = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const userIndex = users.value.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users.value[userIndex] = {
          ...users.value[userIndex],
          ...editForm.value,
        } as User;
      }
      cancelEdit();
    } catch (err) {
      alert('Ошибка сохранения: ' + (err as Error).message);
    } finally {
      isSaving.value = false;
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      users.value = users.value.filter(user => user.id !== userId);
      selectedUsers.value = selectedUsers.value.filter(id => id !== userId);
    } catch (err) {
      alert('Ошибка удаления: ' + (err as Error).message);
    }
  };

  const deleteSelectedUsers = async () => {
    if (!confirm(`Вы уверены, что хотите удалить ${selectedUsers.value.length} пользователей?`))
      return;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      users.value = users.value.filter(user => !selectedUsers.value.includes(user.id));
      selectedUsers.value = [];
    } catch (err) {
      alert('Ошибка удаления: ' + (err as Error).message);
    }
  };

  const toggleUserStatus = (userId: number) => {
    const user = users.value.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'active' ? 'inactive' : 'active';
    }
  };

  const openAddUserModal = () => {
    showAddUserModal.value = true;
  };

  const closeAddUserModal = () => {
    showAddUserModal.value = false;
  };

  const addNewUser = async (newUserData: AddUserForm) => {
    isSaving.value = true;
    try {
      await new Promise(r => setTimeout(r, 1000));
      const newUser: User = {
        id: Math.max(...users.value.map(u => u.id)) + 1,
        name: newUserData.name,
        email: newUserData.email,
        role: newUserData.role,
        status: 'active',
        registrationDate: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        avatar: null,
        loginCount: 0,
        postsCount: 0,
        commentsCount: 0,
      };
      users.value.unshift(newUser);
      showAddUserModal.value = false;
    } catch (err) {
      alert('Ошибка создания пользователя: ' + (err as Error).message);
    } finally {
      isSaving.value = false;
    }
  };

  const openUserDetails = (user: User) => {
    selectedUser.value = user;
    showDetailsModal.value = true;
  };

  const closeDetailsModal = () => {
    showDetailsModal.value = false;
    selectedUser.value = null;
  };

  const exportToCSV = () => {
    const usersToExport =
      selectedUsers.value.length > 0
        ? users.value.filter(u => selectedUsers.value.includes(u.id))
        : sortedUsers.value;
    const headers = ['ID', 'Имя', 'Email', 'Роль', 'Статус', 'Дата регистрации'];
    const rows = usersToExport.map(user => [
      user.id,
      user.name,
      user.email,
      getRoleLabel(user.role),
      user.status === 'active' ? 'Активен' : 'Неактивен',
      formatDate(user.registrationDate),
    ]);
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_export_${new Date().getTime()}.csv`;
    link.click();
  };

  const clearDateFilter = () => {
    dateFrom.value = '';
    dateTo.value = '';
  };

  const clearAllFilters = () => {
    searchQuery.value = '';
    filterRole.value = '';
    filterStatus.value = '';
    clearDateFilter();
  };

  onMounted(() => {
    loadUsers();
  });
</script>

<style scoped>
  .user-table-container {
    padding: 20px;
    background: #f5f5f5;
    min-height: 100vh;
    font-family: sans-serif;
  }

  .table-wrapper {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>
