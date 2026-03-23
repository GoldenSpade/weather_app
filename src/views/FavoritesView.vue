<script setup>
import { ref } from 'vue'
import { useFavoritesStore } from '../stores/favorites'
import WeatherBlock from '../components/WeatherBlock.vue'
import FavoritesLimitModal from '../components/FavoritesLimitModal.vue'
import { usePageTitle } from '../composables/usePageTitle'

usePageTitle('nav.pageTitleFavorites')

const favoritesStore = useFavoritesStore()
const favLimitCity = ref(null)
</script>

<template>
  <div class="favorites">
    <h2 class="favorites__title">{{ $t('favorites.title') }}</h2>

    <div v-if="favoritesStore.cities.length === 0" class="favorites__empty">
      <span class="favorites__empty-icon">⭐</span>
      <p>{{ $t('favorites.empty') }}</p>
    </div>

    <div v-else class="favorites__blocks">
      <WeatherBlock
        v-for="city in favoritesStore.cities"
        :key="city.name"
        :initial-city="city"
        :can-delete="false"
        :readonly-city="true"
        @favorites-limit="favLimitCity = $event"
      />
    </div>

    <FavoritesLimitModal
      v-if="favLimitCity"
      :city-name="favLimitCity.name"
      @close="favLimitCity = null"
    />
  </div>
</template>
