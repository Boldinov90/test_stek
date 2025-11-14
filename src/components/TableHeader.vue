<template>
  <div class="table-header">
  <div class="header-left">
    <h2>{{ title }}</h2>
    <span class="total-count">{{ filteredAndSearchedUsersLength }} записей</span>
  </div>
  
  <div class="header-right">
    <UITextInput
      v-model="localSearchQuery"
      placeholder="Поиск по имени, email..."
      @input="handleSearch"
    />
    <UISelect
      v-model="localFilterRole"
      @change="handleRoleChange"
    />
    <UIButton
      button-text="+ Добавить пользователя"
      type="primary"
      :disabled="isLoading"
      @click="handleClickAddUserModal"
    />
    <UIButton
      button-text="📥 Экспорт"
      type="secondary"
      :disabled="isLoading || selectedUsersLength === 0 && !showAllUsers"
      @click="handleExportToCSV"
    />
    <UIButton
      v-if="selectedUsersLength > 0"
      :button-text="`🗑️ Удалить выбранные (${selectedUsersLength})`"
      type="danger"
      @click="handleDeleteSelectedUsers"
    />
  </div>
</div>
</template>

<script setup lang="ts">
import {ref, defineEmits} from 'vue'
import UIButton from './ui/UIButton.vue'
import UITextInput from './ui/UITextInput.vue'
import UISelect from './ui/UISelect.vue'

const localSearchQuery = ref<string>('')
const localFilterRole = ref<string>('')

interface Props {
  title?: string
  filteredAndSearchedUsersLength?: number
  selectedUsersLength?: number
  isLoading?: boolean
  showAllUsers?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Управление пользователями',
  filteredAndSearchedUsersLength: 0,
  selectedUsersLength: 0,
  isLoading: false,
  showAllUsers: false,
})

const emit = defineEmits<{
  (e: 'click-add-user-modal'): void,
  (e: 'click-export-to-csv'): void,
  (e: 'click-delete-selected-users'): void,
  (e: 'update:search-query', payload: string ): void,
  (e: 'update:filter-role', payload: string ): void,
}>()
const handleClickAddUserModal = () => {
  emit('click-add-user-modal')
}
const handleExportToCSV = () => {
  emit('click-export-to-csv')
}
const handleDeleteSelectedUsers = () => {
  emit('click-delete-selected-users')
}
const handleSearch = (event: string) => {
  localSearchQuery.value = event
  emit('update:search-query', localSearchQuery.value )
}
const handleRoleChange = (event: string) => {
  localFilterRole.value = event
  emit('update:filter-role', localFilterRole.value )
}
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.total-count {
  color: #666;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
