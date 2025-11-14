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
      <UIDateInput
        v-model="dateFrom"
        @input="handleInputDateFrom"
      />
      <!-- <input
        v-model="dateFrom"
        type="date"
        class="date-input"
        @input="handleInputDateFrom"
      /> -->
      <span>-</span>
      <UIDateInput
        v-model="dateTo"
        @input="handleInputDateTo"
      />
      <!-- <input
        v-model="dateTo"
        type="date"
        class="date-input"
        @input="handleInputDateTo"
      /> -->
      <!-- <button 
        @click="clearDateFilter"
        class="btn-clear"
      >
        Очистить
      </button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import UIButton from './ui/UIButton.vue'
import UIDateInput from './ui/UIDateInput.vue'

interface filterButton {
  name: string
  value: string
}
interface Props {
  filterButtons: filterButton[]
  resetFilters: boolean
}

const props = withDefaults(defineProps<Props>(), {
  filterButtons: () => [
    {name: 'btn1', value: 'Кнопка1'},
    {name: 'btn2', value: 'Кнопка2'},
    {name: 'btn3', value: 'Кнопка3'},
  ],
  resetFilters: false
})

const filterStatus = ref<string>('')
const dateFrom = ref<string>('')
const dateTo = ref<string>('')

const emit = defineEmits<{
  (e: 'click-filter-status', value: string): void
  (e: 'input-date-from', value: string): void
  (e: 'input-date-to', value: string): void
}>()

const handleClickFilterStatus = (status: string) => {
  filterStatus.value = status
  emit('click-filter-status', filterStatus.value)
}
const handleInputDateFrom = (value: string) => {
  dateFrom.value = value
  emit('input-date-from', dateFrom.value)
}
const handleInputDateTo = (value: string) => {
  dateTo.value = value
  emit('input-date-to', dateTo.value)
}
watch(() => [props.resetFilters], (val) => {
  if (!val) return
  console.log('props.resetFilters: ', props.resetFilters);
  filterStatus.value = ''
  dateFrom.value = ''
  dateTo.value = ''
}, { deep: true })

</script>

<style scoped>
.filters-section {
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
