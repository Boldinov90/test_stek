<template>
  <input
    :value="modelValue"
    type="text"
    :placeholder="placeholder"
    :disabled="disabled"
    :style="{width: customWidth}"
    class="search-input"
    @input="handleInput"
  />
</template>

<script setup lang="ts">

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
  customWidth?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  customWidth: '250px'
})

const emit = defineEmits<{
  (e: 'input', value: string): void
}>()
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('input', target.value)
}
</script>

<style scoped>
.search-input {
  padding: 7px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #4CAF50;
}
</style>