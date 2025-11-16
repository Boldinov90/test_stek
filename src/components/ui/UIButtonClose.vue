<template>
  <button @click="handleClickClose" class="btn-close">✕</button>
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    (e: 'click'): void;
  }>();

  const handleClickClose = () => {
    emit('click');
  };
</script>

<style scoped>
  .btn-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  }

  .btn-close:hover {
    background: #f0f0f0;
    color: #333;
  }
</style>
