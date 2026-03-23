<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: { type: String, required: true },
  cancelLabel: { type: String, required: true },
})
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="emit('cancel')">
      <div class="modal">
        <h3 class="modal__title">{{ title }}</h3>
        <p class="modal__message">{{ message }}</p>
        <div class="modal__actions">
          <button class="modal__btn modal__btn--cancel" @click="emit('cancel')">
            {{ cancelLabel }}
          </button>
          <button class="modal__btn modal__btn--confirm" @click="emit('confirm')">
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal {
  background: #fff;
  border-radius: 12px;
  padding: 28px 24px 20px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.modal__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 10px;
}

.modal__message {
  font-size: 0.93rem;
  color: #4a5568;
  line-height: 1.5;
  margin-bottom: 24px;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal__btn {
  padding: 8px 20px;
  border-radius: 7px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.18s, color 0.18s;
}

.modal__btn--cancel {
  background: #f1f5f9;
  color: #475569;
}

.modal__btn--cancel:hover {
  background: #e2e8f0;
}

.modal__btn--confirm {
  background: #ef4444;
  color: #fff;
}

.modal__btn--confirm:hover {
  background: #dc2626;
}
</style>
