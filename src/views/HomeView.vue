<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import WeatherBlock from '../components/WeatherBlock.vue'
import FavoritesLimitModal from '../components/FavoritesLimitModal.vue'
import { useWeatherApi } from '../composables/useWeatherApi'

const { t } = useI18n()
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
    <div class="home__blocks">
      <WeatherBlock
        v-for="block in blocks"
        :key="block.id"
        :initial-city="block.city"
        :can-delete="blocks.length > 1"
        @delete="removeBlock(block.id)"
        @favorites-limit="onFavoritesLimit"
        @city-changed="onCityChanged(block.id, $event)"
      />
    </div>

    <button
      v-if="blocks.length < MAX_BLOCKS"
      class="home__add-btn"
      @click="addBlock"
    >
      <span class="home__add-btn-icon">+</span>
      {{ $t('actions.addBlock') }}
    </button>

    <FavoritesLimitModal
      v-if="favLimitCity"
      :city-name="favLimitCity.name"
      @close="favLimitCity = null"
    />
  </div>
</template>

<style scoped>
.home__blocks {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.home__add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #fff;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 600;
  width: 100%;
  justify-content: center;
  transition: border-color 0.18s, color 0.18s, background 0.18s;
}

.home__add-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.home__add-btn-icon {
  font-size: 1.3rem;
  font-weight: 400;
  line-height: 1;
}
</style>
