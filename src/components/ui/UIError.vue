<template>
  <div v-if="showError" class="error-message">
    <span>❌ {{ showError }}</span>
    <UIButton type="retry" button-text="Повторить" @click="handleClickRetryLoad" />
  </div>
</template>

<script setup lang="ts">
  import UIButton from './UIButton.vue';

  interface Props {
    showError: string | null;
  }
  withDefaults(defineProps<Props>(), {
    showError: null,
  });
  const emit = defineEmits<{
    (e: 'click-retry-load'): void;
  }>();

  const handleClickRetryLoad = () => {
    emit('click-retry-load');
  };
  //
</script>

<style scoped>
  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
</style>
