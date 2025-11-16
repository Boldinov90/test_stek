<template>
  <tr
    :class="{
      selected: isSelected,
      editing: isEditing,
      inactive: user.status === 'inactive'
    }"
  >
    <td>
      <input
        type="checkbox"
        :checked="isSelected"
        @change="$emit('toggle-select-user', user.id)"
      />
    </td>
    <td>{{ user.id }}</td>
    <td>
      <div v-if="isEditing">
        <input
          v-model="editForm.name"
          type="text"
          class="edit-input"
        />
      </div>
      <div v-else class="user-name-cell">
        <img
          :src="user.avatar || getDefaultAvatar(user.name)"
          :alt="user.name"
          class="avatar"
        />
        <span>{{ user.name }}</span>
      </div>
    </td>
    <td>
      <div v-if="isEditing">
        <input
          v-model="editForm.email"
          type="email"
          class="edit-input"
        />
      </div>
      <div v-else>{{ user.email }}</div>
    </td>
    <td>
      <div v-if="isEditing">
        <select
          v-model="editForm.role"
          class="edit-select"
        >
          <option value="admin">Администратор</option>
          <option value="user">Пользователь</option>
          <option value="moderator">Модератор</option>
        </select>
      </div>
      <div v-else>
        <span
          :class="['role-badge', 'role-' + user.role]"
        >
          {{ getRoleLabel(user.role) }}
        </span>
      </div>
    </td>
    <td>
      <span
        :class="[
          'status-badge',
          user.status === 'active' ? 'status-active' : 'status-inactive'
        ]"
        @click="$emit('toggle-user-status', user.id)"
        style="cursor: pointer;"
      >
        {{ user.status === 'active' ? '✓ Активен' : '✗ Неактивен' }}
      </span>
    </td>
    <td>{{ formatDate(user.registrationDate) }}</td>
    <td>
      <span :class="getActivityClass(user.lastActivity)">
        {{ formatRelativeTime(user.lastActivity) }}
      </span>
    </td>
    <td>
      <div class="action-buttons">
        <button
          v-if="!isEditing"
          @click="$emit('start-edit', user)"
          class="btn-icon"
          title="Редактировать"
        >✏️</button>
        <button
          v-if="isEditing"
          @click="$emit('save-edit', user.id)"
          class="btn-icon btn-success"
          title="Сохранить"
        >✓</button>
        <button
          v-if="isEditing"
          @click="$emit('cancel-edit')"
          class="btn-icon btn-cancel"
          title="Отмена"
        >✗</button>
        <button
          v-if="!isEditing"
          @click="$emit('open-user-details', user)"
          class="btn-icon"
          title="Подробнее"
        >👁️</button>
        <button
          v-if="!isEditing"
          @click="$emit('delete-user', user.id)"
          class="btn-icon btn-danger"
          title="Удалить"
        >🗑️</button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import type { User } from '../types.ts'
import {
  getDefaultAvatar,
  getActivityClass,
  formatRelativeTime,
  formatDate,
  getRoleLabel
} from '../utils.ts'

const props = defineProps<{
  user: User;
  selectedUsers: number[];
  editingUserId: number | null;
  editForm: { name: string; email: string; role: string };
}>();

const emit = defineEmits<{
  (e: 'toggle-select-user', id: number): void;
  (e: 'start-edit', user: User): void;
  (e: 'save-edit', id: number): void;
  (e: 'cancel-edit'): void;
  (e: 'open-user-details', user: User): void;
  (e: 'delete-user', id: number): void;
  (e: 'toggle-user-status', id: number): void;
}>();

const isSelected = computed(() => props.selectedUsers.includes(props.user.id));
const isEditing  = computed(() => props.editingUserId === props.user.id);
</script>

<style scoped>
.user-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.user-table tbody tr {
  transition: background 0.2s;
}

.user-table tbody tr:hover {
  background: #fafafa;
}

.user-table tbody tr.selected {
  background: #e8f5e9;
}

.user-table tbody tr.editing {
  background: #fff9c4;
}

.user-table tbody tr.inactive {
  opacity: 0.6;
}

.user-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.role-admin {
  background: #ffebee;
  color: #c62828;
}

.role-user {
  background: #e3f2fd;
  color: #1565c0;
}

.role-moderator {
  background: #fff3e0;
  color: #e65100;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-inactive {
  background: #ffebee;
  color: #c62828;
}

.activity-recent {
  color: #2e7d32;
  font-weight: 500;
}

.activity-week {
  color: #1565c0;
}

.activity-month {
  color: #e65100;
}

.activity-old {
  color: #757575;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.btn-icon {
  padding: 6px 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.btn-icon.btn-success {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.btn-icon.btn-cancel {
  background: #ff9800;
  color: white;
  border-color: #ff9800;
}

.btn-icon.btn-danger {
  border-color: #f44336;
}

.btn-icon.btn-danger:hover {
  background: #f44336;
  color: white;
}

.edit-input,
.edit-select {
  padding: 6px 10px;
  border: 1px solid #4CAF50;
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
}

</style>