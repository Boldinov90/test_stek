<template>
  <div v-if="showModal" class="modal-overlay" @click.self="handleCloseAddUserModal">
    <div class="modal">
      <div class="modal-header">
        <h3>Добавить нового пользователя</h3>
        <UIButtonClose @click="handleCloseAddUserModal" />
      </div>
      <div class="modal-body">
        <div class="form-group">
          <UITextInput
            label="Имя*"
            custom-width="calc(100% - 26px)"
            :model-value="newUser.name"
            :class="{ error: newUserErrors.name }"
            @input="validateNewUserName"
          />
          <span v-if="newUserErrors.name" class="error-text">
            {{ newUserErrors.name }}
          </span>
        </div>
        <div class="form-group">
          <UITextInput
            label="Email*"
            custom-width="calc(100% - 26px)"
            :model-value="newUser.email"
            :class="{ error: newUserErrors.email }"
            @input="validateNewUserEmail"
          />
          <span v-if="newUserErrors.email" class="error-text">
            {{ newUserErrors.email }}
          </span>
        </div>
        <div class="form-group">
          <UISelect
            label="Роль*"
            :model-value="newUser.role"
            @change="newUser.role = $event.toString()"
          />
        </div>
        <div class="form-group">
          <label>
            <input v-model="newUser.sendWelcomeEmail" type="checkbox" />
            Отправить приветственное письмо
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <UIButton type="secondary" button-text="Отмена" @click="handleCloseAddUserModal" />
        <UIButton
          type="primary"
          :button-text="isSaving ? 'Сохранение...' : 'Добавить'"
          :disabled="!isNewUserValid || isSaving"
          @click="handleAddNewUser"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type { User, NewUser, NewUserErrors } from '../types.ts';
  import UIButton from './ui/UIButton.vue';
  import UIButtonClose from './ui/UIButtonClose.vue';
  import UITextInput from './ui/UITextInput.vue';
  import UISelect from './ui/UISelect.vue';

  interface Props {
    showModal: boolean;
    users: User[];
    isSaving: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    showModal: false,
    users: () => [],
    isSaving: false,
  });

  const newUser = ref<NewUser>({
    name: '',
    email: '',
    role: 'user',
    sendWelcomeEmail: true,
  });

  const newUserErrors = ref<NewUserErrors>({
    name: '',
    email: '',
  });

  const emit = defineEmits<{
    (e: 'close-modal'): void;
    (e: 'click-add-new-user', newUser: NewUser): void;
  }>();

  const handleCloseAddUserModal = () => {
    emit('close-modal');
  };
  const handleAddNewUser = () => {
    emit('click-add-new-user', newUser.value);
  };

  const isNewUserValid = computed(() => {
    return (
      newUser.value.name.trim().length > 0 &&
      newUser.value.email.trim().length > 0 &&
      validateEmail(newUser.value.email) &&
      !newUserErrors.value.name &&
      !newUserErrors.value.email
    );
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const validateNewUserName = (event: string) => {
    newUser.value.name = event;
    if (newUser.value.name.trim().length === 0) {
      newUserErrors.value.name = 'Имя обязательно для заполнения';
    } else if (newUser.value.name.trim().length < 3) {
      newUserErrors.value.name = 'Имя должно содержать минимум 3 символа';
    } else {
      newUserErrors.value.name = '';
    }
  };

  const validateNewUserEmail = (event: string) => {
    newUser.value.email = event;
    if (newUser.value.email.trim().length === 0) {
      newUserErrors.value.email = 'Email обязателен для заполнения';
    } else if (!validateEmail(newUser.value.email)) {
      newUserErrors.value.email = 'Некорректный формат email';
    } else if (props.users.some(u => u.email === newUser.value.email)) {
      newUserErrors.value.email = 'Пользователь с таким email уже существует';
    } else {
      newUserErrors.value.email = '';
    }
  };
  watch(
    () => [props.showModal],
    () => {
      if (!props.showModal) {
        newUser.value.name = '';
        newUser.value.email = '';
      }
    },
    { deep: true }
  );
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    display: flexxs;
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .modal.modal-large {
    max-width: 700px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 20px;
    color: #333;
  }

  .modal-body {
    padding: 20px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #555;
  }

  .form-group input.error {
    border-color: #f44336;
  }

  .error-text {
    color: #f44336;
    font-size: 12px;
    margin-top: 5px;
    display: block;
  }

  .modal-footer {
    padding: 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
</style>
