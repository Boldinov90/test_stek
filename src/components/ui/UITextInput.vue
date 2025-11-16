<template>
  <div class="search-input__wrapper">
    <label v-if="label !== ''" :style="{ width: label === '' ? '0' : '100%' }">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :style="{ width: customWidth }"
      class="search-input"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    customWidth?: string;
    label?: string;
  }

  withDefaults(defineProps<Props>(), {
    modelValue: '',
    placeholder: '',
    disabled: false,
    customWidth: '250px',
    label: '',
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
  .search-input__wrapper {
    display: flex;
    flex-direction: column;
  }

  .search-input__wrapper label {
    margin-bottom: 8px;
    color: #555;
  }

  .search-input {
    padding: 7px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 250px;
    font-size: 14px;
  }

  .search-input:focus {
    outline: none;
    border-color: #4caf50;
  }
</style>
