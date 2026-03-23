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

<style scoped>
.home__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 800px) {
  .home__grid {
    grid-template-columns: 1fr;
    align-items: start;
  }
}

.home__add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #fff;
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  color: #94a3b8;
  transition: border-color 0.2s, color 0.2s, background 0.2s, box-shadow 0.2s;
  width: 100%;
  min-height: 120px;
}

@media (max-width: 800px) {
  .home__add-card {
    min-height: 100px;
  }

  .home__add-card-label {
    display: none;
  }
}

.home__add-card:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
  box-shadow: 0 2px 12px rgba(59, 130, 246, 0.1);
}

.home__add-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px dashed currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.home__add-card-label {
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
