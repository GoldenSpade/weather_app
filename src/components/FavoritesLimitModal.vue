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
