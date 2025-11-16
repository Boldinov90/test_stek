<template>
  <input :value="modelValue" type="date" class="date-input" @input="handleInput" />
</template>

<script setup lang="ts">
  interface Props {
    modelValue: string;
  }

  withDefaults(defineProps<Props>(), {
    modelValue: '',
  });
  const emit = defineEmits<{
    (e: 'input', value: string): void;
  }>();

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('input', target.value);
  };
</script>

<style scoped>
  .date-input {
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
</style>
