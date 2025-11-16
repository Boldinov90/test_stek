<template>
  <div class="pagination">
    <div class="pagination-info">
      Показано {{ paginationStart }} - {{ paginationEnd }} из {{ totalItems }}
    </div>
    <div class="pagination-controls">
      <UIButton
        button-text="⏮️"
        type="outlined"
        :disabled="currentPage === 1"
        @click="goToFirstPage"
      />
      <UIButton
        button-text="◀️"
        type="outlined"
        :disabled="currentPage === 1"
        @click="goToPrevPage"
      />
      <UIButton
        v-for="page in visiblePages"
        :key="page"
        :button-text="`${page}`"
        :type="currentPage === page ? 'primary' : 'outlined'"
        :disabled="page === '...'"
        @click="handlePageClick(page)"
      />
      <UIButton
        button-text="▶️"
        type="outlined"
        :disabled="currentPage === totalPages"
        @click="goToNextPage"
      />
      <UIButton
        button-text="⏭️"
        type="outlined"
        :disabled="currentPage === totalPages"
        @click="goToLastPage"
      />
    </div>
    <div class="page-size-selector">
      <label>На странице:</label>
      <UISelect :model-value="pageSize" :options="pageSizeOptions" @change="handlePageSizeChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { Option } from '../types.ts';
  import UIButton from './ui/UIButton.vue';
  import UISelect from './ui/UISelect.vue';

  interface Props {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    pageSizeOptions?: Option[];
  }

  const props = withDefaults(defineProps<Props>(), {
    pageSizeOptions: () => [
      { value: 10, label: 10 },
      { value: 25, label: 25 },
      { value: 50, label: 50 },
      { value: 100, label: 100 },
    ],
  });

  const emit = defineEmits<{
    (e: 'update:current-page', page: number): void;
    (e: 'update:page-size', event: string | number): void;
  }>();
  const handlePageSizeChange = (event: string | number) => {
    const newSize = typeof event === 'string' ? parseInt(event, 10) : event;
    emit('update:page-size', newSize);
    emit('update:current-page', 1);
  };

  const totalPages = computed(() => {
    return Math.ceil(props.totalItems / props.pageSize);
  });

  const paginationStart = computed(() => {
    return (props.currentPage - 1) * props.pageSize + 1;
  });

  const paginationEnd = computed(() => {
    const end = props.currentPage * props.pageSize;
    return end > props.totalItems ? props.totalItems : end;
  });

  const visiblePages = computed(() => {
    const pages: (number | string)[] = [];
    const total = totalPages.value;
    const current = props.currentPage;
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }
    return pages;
  });

  const goToFirstPage = () => {
    if (props.currentPage !== 1) {
      emit('update:current-page', 1);
    }
  };

  const goToPrevPage = () => {
    if (props.currentPage > 1) {
      emit('update:current-page', props.currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (props.currentPage < totalPages.value) {
      emit('update:current-page', props.currentPage + 1);
    }
  };

  const goToLastPage = () => {
    if (props.currentPage !== totalPages.value) {
      emit('update:current-page', totalPages.value);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== props.currentPage) {
      emit('update:current-page', page);
    }
  };
</script>

<style scoped>
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 15px 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    gap: 15px;
    flex-wrap: wrap;
  }

  .pagination-info {
    color: #666;
    font-size: 14px;
    white-space: nowrap;
  }

  .pagination-controls {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-page {
    padding: 6px 12px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    min-width: 36px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-page:hover:not(:disabled):not(.disabled) {
    background: #f0f0f0;
    border-color: #ccc;
  }

  .btn-page:disabled,
  .btn-page.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f9f9f9;
  }

  .btn-page.active {
    background: #4caf50;
    color: white;
    border-color: #4caf50;
  }

  .btn-page.active:hover {
    background: #45a049;
    border-color: #45a049;
  }

  .page-size-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .page-size-selector label {
    color: #666;
    font-size: 14px;
  }

  .page-size-select {
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    background: white;
  }

  .page-size-select:focus {
    outline: none;
    border-color: #4caf50;
  }

  @media (max-width: 768px) {
    .pagination {
      flex-direction: column;
      gap: 15px;
    }

    .pagination-info {
      order: 1;
    }

    .pagination-controls {
      order: 3;
    }

    .page-size-selector {
      order: 2;
    }
  }
</style>
