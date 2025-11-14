<template>
  <div class="select-wrapper">
    <label
      v-if="label !== ''"
      :style="{width: (label === '') ? '0' : '100%'}"
    >
      {{ label }}
    </label>
    <select 
      :value="modelValue"
      class="role-filter"
      @change="handleChange"
    >
      <option 
        v-for="option in options" 
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options?: Option[]
  label?: string
}

withDefaults(defineProps<Props>(), {
  options: () => [
    { value: '', label: 'Все роли' },
    { value: 'admin', label: 'Администратор' },
    { value: 'user', label: 'Пользователь' },
    { value: 'moderator', label: 'Модератор' }
  ],
  label: ''
})

const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('change', target.value)
}
</script>

<style scoped>
.select-wrapper {
  display: flex;
  flex-direction: column;
}
.select-wrapper label {
  margin-bottom: 8px;
}
.role-filter {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
.role-filter:focus {
  outline: none;
}
</style>