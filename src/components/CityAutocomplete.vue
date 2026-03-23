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
