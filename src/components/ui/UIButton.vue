<template>
  <button 
    :class="['btn', type === 'primary' ? 'btn-primary' : type === 'secondary' ? 'btn-secondary' : type === 'danger' ? 'btn-danger' : 'btn-outlined']"
    :disabled="disabled"
  >
    {{ props.buttonText }}
  </button>
</template>

<script setup lang="ts">
interface Props {
  buttonText?: string
  disabled?: boolean
  type?: 'primary' | 'secondary' | 'danger' | 'outlined'
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Кнопка',
  disabled: false,
  type: 'primary'
})
</script>

<style scoped>
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #45a049;
}

.btn-secondary {
  background: #2196F3;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #0b7dda;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #da190b;
}
.btn-outlined {
  background: white;
  color: black;
  border: 1px solid #ddd;
  transition: all 0.3s;
  
}
.btn-outlined:hover:not(:disabled) {
  background: #f0f0f0;
}
</style>