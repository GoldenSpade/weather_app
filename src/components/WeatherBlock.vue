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
const showUnfavoriteModal = ref(false)

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
    showUnfavoriteModal.value = true
  } else {
    const added = favoritesStore.add(city.value)
    if (!added) emit('favorites-limit', city.value)
  }
}

function confirmRemoveFavorite() {
  favoritesStore.remove(city.value.name)
  showUnfavoriteModal.value = false
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
      v-if="showUnfavoriteModal"
      :title="$t('modal.confirmRemoveFav')"
      :message="$t('modal.confirmRemoveFavText', { city: city?.name || '' })"
      :confirm-label="$t('modal.confirm')"
      :cancel-label="$t('modal.cancel')"
      @confirm="confirmRemoveFavorite"
      @cancel="showUnfavoriteModal = false"
    />

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
