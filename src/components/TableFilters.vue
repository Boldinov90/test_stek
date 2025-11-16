<template>
  <div class="filters-section">
    <div class="filter-group">
      <label>Статус:</label>
      <UIButton
        v-for="btn in filterButtons"
        :key="btn.name"
        :type="filterStatus === btn.name ? 'primary' : 'outlined'"
        :button-text="btn.value"
        @click="handleClickFilterStatus(btn.name)"
      />
    </div>
    <div class="filter-group">
      <label>Дата регистрации:</label>
      <UIDateInput :modelValue="dateFrom" @input="handleInputDateFrom($event)" />
      <span>-</span>
      <UIDateInput :modelValue="dateTo" @input="handleInputDateTo($event)" />
      <UIButton
        type="outlined"
        button-text="Очистить"
        :disabled="dateFrom === '' && dateTo === ''"
        @click="clearDateFilter"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { filterButton } from '../types.ts';
  import UIButton from './ui/UIButton.vue';
  import UIDateInput from './ui/UIDateInput.vue';

  interface Props {
    filterButtons: filterButton[];
    filterStatus: string;
    dateFrom: string;
    dateTo: string;
  }

  withDefaults(defineProps<Props>(), {
    filterButtons: () => [
      { name: 'btn1', value: 'Кнопка1' },
      { name: 'btn2', value: 'Кнопка2' },
      { name: 'btn3', value: 'Кнопка3' },
    ],
    filterStatus: '',
    dateFrom: '',
    dateTo: '',
  });

  const emit = defineEmits<{
    (e: 'click-filter-status', value: string): void;
    (e: 'input-date-from', value: string): void;
    (e: 'input-date-to', value: string): void;
    (e: 'clear-all-input-date'): void;
  }>();

  const handleClickFilterStatus = (event: string) => {
    emit('click-filter-status', event);
  };

  const handleInputDateFrom = (event: string) => {
    emit('input-date-from', event);
  };

  const handleInputDateTo = (event: string) => {
    emit('input-date-to', event);
  };

  const clearDateFilter = () => {
    emit('clear-all-input-date');
  };
</script>

<style scoped>
  .filters-section {
    background: white;
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .filter-group:last-child {
    margin-bottom: 0;
  }

  .filter-group label {
    font-weight: 500;
    color: #555;
    min-width: 150px;
  }
</style>
