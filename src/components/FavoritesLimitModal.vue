<script setup>
defineProps({
  cityName: { type: String, required: true },
})
const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="emit('close')">
      <div class="favorites-limit-modal">
        <div class="favorites-limit-modal__icon">⭐</div>
        <h3 class="favorites-limit-modal__title">{{ $t('modal.favoritesLimit') }}</h3>
        <p class="favorites-limit-modal__message">
          {{ $t('modal.favoritesLimitText', { city: cityName }) }}
        </p>
        <button class="favorites-limit-modal__btn" @click="emit('close')">
          {{ $t('modal.ok') }}
        </button>
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

.favorites-limit-modal {
  background: #fff;
  border-radius: 12px;
  padding: 28px 24px 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.favorites-limit-modal__icon {
  font-size: 2.2rem;
}

.favorites-limit-modal__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a202c;
}

.favorites-limit-modal__message {
  font-size: 0.92rem;
  color: #4a5568;
  line-height: 1.5;
  margin-bottom: 8px;
}

.favorites-limit-modal__btn {
  background: #1e3a5f;
  color: #fff;
  padding: 8px 28px;
  border-radius: 7px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.18s;
}

.favorites-limit-modal__btn:hover {
  background: #2d5282;
}
</style>
