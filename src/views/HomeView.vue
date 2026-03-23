<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import WeatherBlock from '../components/WeatherBlock.vue'
import FavoritesLimitModal from '../components/FavoritesLimitModal.vue'
import { useWeatherApi } from '../composables/useWeatherApi'
import { usePageTitle } from '../composables/usePageTitle'

const { t } = useI18n()
usePageTitle('nav.pageTitleHome')
const { getCityByIp } = useWeatherApi()

const MAX_BLOCKS = 5

const blocks = ref([{ id: Date.now(), city: null }])
const favLimitCity = ref(null)

onMounted(async () => {
  const ipCity = await getCityByIp()
  if (ipCity) {
    blocks.value[0].city = ipCity
  }
})

function addBlock() {
  if (blocks.value.length >= MAX_BLOCKS) return
  blocks.value.push({ id: Date.now(), city: null })
}

function removeBlock(id) {
  blocks.value = blocks.value.filter(b => b.id !== id)
}

function onFavoritesLimit(city) {
  favLimitCity.value = city
}

function onCityChanged(id, city) {
  const block = blocks.value.find(b => b.id === id)
  if (block) block.city = city
}
</script>

<template>
  <div class="home">
    <div class="home__grid">
      <WeatherBlock
        v-for="block in blocks"
        :key="block.id"
        :initial-city="block.city"
        :can-delete="blocks.length > 1"
        @delete="removeBlock(block.id)"
        @favorites-limit="onFavoritesLimit"
        @city-changed="onCityChanged(block.id, $event)"
      />

      <button
        v-if="blocks.length < MAX_BLOCKS"
        class="home__add-card"
        :title="$t('actions.addBlock')"
        @click="addBlock"
      >
        <span class="home__add-card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
        <span class="home__add-card-label">{{ $t('actions.addBlock') }}</span>
      </button>
    </div>

    <FavoritesLimitModal
      v-if="favLimitCity"
      :city-name="favLimitCity.name"
      @close="favLimitCity = null"
    />
  </div>
</template>
