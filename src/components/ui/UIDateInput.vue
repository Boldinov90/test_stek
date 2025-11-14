<template>
  <input
  v-model="modelValue"
  type="date"
  class="date-input"
  @input="handleInput"
/>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const modelValue = ref<string>('')

const emit = defineEmits<{
  (e: 'input', value: string): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('input', target.value)
}

</script>

<style scoped>
.date-input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
</style>