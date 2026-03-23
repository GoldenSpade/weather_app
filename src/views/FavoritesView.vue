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

<style scoped>
.favorites__title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 20px;
}

.favorites__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
  color: #94a3b8;
  font-size: 0.95rem;
  text-align: center;
}

.favorites__empty-icon {
  font-size: 3rem;
}

.favorites__blocks {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

@media (max-width: 800px) {
  .favorites__blocks {
    grid-template-columns: 1fr;
  }
}
</style>
