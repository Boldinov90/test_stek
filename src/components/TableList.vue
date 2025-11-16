<template>
  <table class="user-table">
    <thead>
      <tr>
        <th>
          <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll" />
        </th>
        <th @click="sortBy('id')" :class="{ sortable: true, active: sortColumn === 'id' }">
          ID
          <span v-if="sortColumn === 'id'">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </th>
        <th @click="sortBy('name')" :class="{ sortable: true, active: sortColumn === 'name' }">
          Имя
          <span v-if="sortColumn === 'name'">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </th>
        <th @click="sortBy('email')" :class="{ sortable: true, active: sortColumn === 'email' }">
          Email
          <span v-if="sortColumn === 'email'">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </th>
        <th>Роль</th>
        <th>Статус</th>
        <th
          @click="sortBy('registrationDate')"
          :class="{ sortable: true, active: sortColumn === 'registrationDate' }"
        >
          Дата регистрации
          <span v-if="sortColumn === 'registrationDate'">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </th>
        <th>Последняя активность</th>
        <th>Действия</th>
      </tr>
    </thead>
    <tbody>
      <TableListItem
        v-for="user in paginatedUsers"
        :key="user.id"
        :user="user"
        :selected-users="selectedUsers"
        :editing-user-id="editingUserId"
        :edit-form="editForm"
        @toggle-select-user="emit('toggle-select-user', $event)"
        @start-edit="emit('start-edit', $event)"
        @save-edit="emit('save-edit', $event)"
        @cancel-edit="emit('cancel-edit')"
        @open-user-details="emit('open-user-details', $event)"
        @delete-user="emit('delete-user', $event)"
        @toggle-user-status="emit('toggle-user-status', $event)"
      />
    </tbody>
  </table>
  <div v-if="paginatedUsers.length === 0" class="no-data">
    <p>😔 Нет данных для отображения</p>
    <UIButton button-text="Сбросить фильтры" type="primary" @click="clearAllFilters" />
  </div>
</template>

<script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  import type { User } from '../types.ts';
  import TableListItem from './TableListItem.vue';
  import UIButton from './ui/UIButton.vue';

  defineProps<{
    paginatedUsers: User[];
    selectedUsers: number[];
    editingUserId: number | null;
    editForm: { name: string; email: string; role: string };
    sortColumn: keyof User | 'registrationDate' | 'lastActivity';
    sortDirection: 'asc' | 'desc';
    isAllSelected: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'toggle-select-user', userId: number): void;
    (e: 'toggle-select-all'): void;
    (e: 'sort-by', column: keyof User): void;
    (e: 'start-edit', user: User): void;
    (e: 'save-edit', id: number): void;
    (e: 'cancel-edit'): void;
    (e: 'open-user-details', user: User): void;
    (e: 'delete-user', id: number): void;
    (e: 'toggle-user-status', id: number): void;
    (e: 'clear-all-filters'): void;
  }>();

  const toggleSelectAll = () => emit('toggle-select-all');
  const sortBy = (column: keyof User) => emit('sort-by', column);
  const clearAllFilters = () => emit('clear-all-filters');
</script>

<style scoped>
  .user-table {
    width: 100%;
    border-collapse: collapse;
  }

  .user-table thead {
    border-bottom: 2px solid #ddd;
  }

  .user-table th {
    padding: 12px;
    text-align: left;
    font-weight: 600;
    color: #555;
    font-size: 14px;
  }

  .user-table th.sortable {
    cursor: pointer;
    user-select: none;
  }

  .user-table th.sortable:hover {
    background: #eeeeee;
  }

  .user-table th.active {
    color: #4caf50;
  }

  .no-data {
    padding: 60px 20px;
    text-align: center;
    color: #999;
  }

  .no-data p {
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
