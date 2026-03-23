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
