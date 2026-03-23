<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWeatherApi } from '../composables/useWeatherApi'

const props = defineProps({
  modelValue: { type: Object, default: null },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const { t, locale } = useI18n()
const { searchCities } = useWeatherApi()

const query = ref(props.modelValue?.label || '')
const results = ref([])
const isOpen = ref(false)
const isLoading = ref(false)
const activeIndex = ref(-1)
let debounceTimer = null

watch(() => props.modelValue, (city) => {
  query.value = city?.label || ''
})

watch(locale, () => {
  if (props.modelValue) {
    query.value = props.modelValue.label
  }
})

async function onInput() {
  activeIndex.value = -1
  clearTimeout(debounceTimer)

  if (query.value.length < 2) {
    results.value = []
    isOpen.value = false
    return
  }

  isLoading.value = true
  debounceTimer = setTimeout(async () => {
    try {
      results.value = await searchCities(query.value, locale.value)
      isOpen.value = results.value.length > 0
    } finally {
      isLoading.value = false
    }
  }, 400)
}

function select(city) {
  query.value = city.label
  emit('update:modelValue', city)
  isOpen.value = false
  results.value = []
}

function onKeydown(e) {
  if (!isOpen.value) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter' && activeIndex.value >= 0) {
    e.preventDefault()
    select(results.value[activeIndex.value])
  } else if (e.key === 'Escape') {
    isOpen.value = false
  }
}

function onBlur() {
  setTimeout(() => {
    isOpen.value = false
    if (props.modelValue) query.value = props.modelValue.label
    else query.value = ''
  }, 200)
}
</script>

<template>
  <div class="city-autocomplete">
    <div class="city-autocomplete__field">
      <input
        v-model="query"
        class="city-autocomplete__input"
        type="text"
        :placeholder="$t('search.placeholder')"
        :disabled="disabled"
        autocomplete="off"
        @input="onInput"
        @keydown="onKeydown"
        @blur="onBlur"
        @focus="isOpen = results.length > 0"
      />
      <span v-if="isLoading" class="city-autocomplete__spinner" />
    </div>

    <ul v-if="isOpen" class="city-autocomplete__dropdown">
      <li
        v-for="(city, i) in results"
        :key="`${city.lat}-${city.lon}`"
        class="city-autocomplete__item"
        :class="{ 'city-autocomplete__item--active': i === activeIndex }"
        @mousedown.prevent="select(city)"
      >
        <span class="city-autocomplete__item-name">{{ city.name }}</span>
        <span class="city-autocomplete__item-country">{{ city.country }}</span>
      </li>
    </ul>

    <p v-if="!isLoading && query.length >= 2 && isOpen === false && results.length === 0" class="city-autocomplete__no-results">
      {{ $t('search.noResults') }}
    </p>
  </div>
</template>

<style scoped>
.city-autocomplete {
  position: relative;
  width: 100%;
}

.city-autocomplete__field {
  position: relative;
  display: flex;
  align-items: center;
}

.city-autocomplete__input {
  width: 100%;
  padding: 10px 40px 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1a202c;
  background: #fff;
  outline: none;
  transition: border-color 0.18s;
}

.city-autocomplete__input:focus {
  border-color: #3b82f6;
}

.city-autocomplete__input:disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.city-autocomplete__spinner {
  position: absolute;
  right: 12px;
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.city-autocomplete__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  list-style: none;
  z-index: 200;
  overflow: hidden;
}

.city-autocomplete__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
  gap: 8px;
}

.city-autocomplete__item:hover,
.city-autocomplete__item--active {
  background: #eff6ff;
}

.city-autocomplete__item-name {
  font-size: 0.93rem;
  color: #1a202c;
  font-weight: 500;
}

.city-autocomplete__item-country {
  font-size: 0.8rem;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

.city-autocomplete__no-results {
  margin-top: 6px;
  font-size: 0.85rem;
  color: #94a3b8;
  padding: 0 4px;
}
</style>
