<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFavoritesStore } from '../stores/favorites'
import { useWeatherApi } from '../composables/useWeatherApi'
import CityAutocomplete from './CityAutocomplete.vue'
import WeatherCard from './WeatherCard.vue'
import WeatherChart from './WeatherChart.vue'
import ConfirmModal from './ConfirmModal.vue'

const props = defineProps({
  initialCity: { type: Object, default: null },
  canDelete: { type: Boolean, default: false },
  readonlyCity: { type: Boolean, default: false },
})
const emit = defineEmits(['delete', 'favorites-limit', 'city-changed'])

const { t, locale } = useI18n()
const favoritesStore = useFavoritesStore()
const { getCurrentWeather, getForecast } = useWeatherApi()

const city = ref(props.initialCity)
const viewMode = ref('day')
const weather = ref(null)
const forecast = ref(null)
const isLoading = ref(false)
const error = ref(null)
const showDeleteModal = ref(false)

async function loadWeather(selectedCity) {
  isLoading.value = true
  error.value = null
  weather.value = null
  forecast.value = null
  try {
    const [w, f] = await Promise.all([
      getCurrentWeather(selectedCity.lat, selectedCity.lon, locale.value),
      getForecast(selectedCity.lat, selectedCity.lon, locale.value),
    ])
    weather.value = w
    forecast.value = f
  } catch {
    error.value = t('errors.fetchFailed')
  } finally {
    isLoading.value = false
  }
}

watch(city, (newCity) => {
  if (newCity) {
    loadWeather(newCity)
    emit('city-changed', newCity)
  }
})

watch(() => props.initialCity, (val) => {
  if (val && (!city.value || val.name !== city.value.name)) {
    city.value = val
  }
})

watch(locale, () => {
  if (city.value) loadWeather(city.value)
})

function toggleFavorite() {
  if (!city.value) return
  if (favoritesStore.isFavorite(city.value.name)) {
    favoritesStore.remove(city.value.name)
  } else {
    const added = favoritesStore.add(city.value)
    if (!added) emit('favorites-limit', city.value)
  }
}

function confirmDelete() {
  showDeleteModal.value = false
  emit('delete')
}

if (props.initialCity) {
  loadWeather(props.initialCity)
}
</script>

<template>
  <div class="weather-block">
    <div class="weather-block__header">
      <div class="weather-block__search">
        <CityAutocomplete v-model="city" :disabled="readonlyCity" />
      </div>

      <div class="weather-block__controls">
        <button
          v-if="city"
          class="weather-block__fav-btn"
          :class="{ 'weather-block__fav-btn--active': favoritesStore.isFavorite(city.name) }"
          :title="favoritesStore.isFavorite(city.name) ? $t('actions.removeFromFavorites') : $t('actions.addToFavorites')"
          @click="toggleFavorite"
        >
          {{ favoritesStore.isFavorite(city.name) ? '★' : '☆' }}
        </button>

        <button
          v-if="canDelete"
          class="weather-block__delete-btn"
          :title="$t('actions.deleteBlock')"
          @click="showDeleteModal = true"
        >
          ✕
        </button>
      </div>
    </div>

    <div class="weather-block__tabs">
      <button
        class="weather-block__tab"
        :class="{ 'weather-block__tab--active': viewMode === 'day' }"
        @click="viewMode = 'day'"
      >
        {{ $t('tabs.day') }}
      </button>
      <button
        class="weather-block__tab"
        :class="{ 'weather-block__tab--active': viewMode === 'week' }"
        @click="viewMode = 'week'"
      >
        {{ $t('tabs.week') }}
      </button>
    </div>

    <div class="weather-block__body">
      <div v-if="isLoading" class="weather-block__preloader">
        <span class="weather-block__spinner" />
        <span>{{ $t('preloader.loading') }}</span>
      </div>

      <div v-else-if="error" class="weather-block__error">
        {{ error }}
      </div>

      <div v-else-if="!city" class="weather-block__empty">
        <span class="weather-block__empty-icon">🔍</span>
        <p>{{ $t('search.placeholder') }}</p>
      </div>

      <template v-else-if="weather && forecast">
        <WeatherCard
          :weather="weather"
          :forecast="forecast"
          :view-mode="viewMode"
        />
        <WeatherChart
          :forecast="forecast"
          :view-mode="viewMode"
        />
      </template>
    </div>

    <ConfirmModal
      v-if="showDeleteModal"
      :title="$t('modal.confirmDelete')"
      :message="$t('modal.confirmDeleteText', { city: city?.name || '' })"
      :confirm-label="$t('modal.confirm')"
      :cancel-label="$t('modal.cancel')"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<style scoped>
.weather-block {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.weather-block__header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.weather-block__search {
  flex: 1;
  min-width: 0;
}

.weather-block__controls {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.weather-block__fav-btn,
.weather-block__delete-btn {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, color 0.18s, border-color 0.18s;
  flex-shrink: 0;
}

.weather-block__fav-btn {
  color: #94a3b8;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
}

.weather-block__fav-btn:hover {
  border-color: #f59e0b;
  color: #f59e0b;
}

.weather-block__fav-btn--active {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #f59e0b;
}

.weather-block__delete-btn {
  color: #94a3b8;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  font-size: 0.9rem;
}

.weather-block__delete-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

.weather-block__tabs {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
}

.weather-block__tab {
  flex: 1;
  padding: 7px 12px;
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: 600;
  color: #64748b;
  transition: background 0.18s, color 0.18s;
}

.weather-block__tab--active {
  background: #fff;
  color: #1e3a5f;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.weather-block__body {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.weather-block__preloader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #94a3b8;
  font-size: 0.9rem;
  padding: 32px 0;
}

.weather-block__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.weather-block__error {
  text-align: center;
  color: #ef4444;
  font-size: 0.9rem;
  padding: 32px 0;
}

.weather-block__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 0.9rem;
  padding: 32px 0;
}

.weather-block__empty-icon {
  font-size: 2rem;
}
</style>
