import { defineStore } from 'pinia'
import { ref } from 'vue'

const MAX_FAVORITES = 5
const STORAGE_KEY = 'weather_favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  const cities = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities.value))
  }

  function isFavorite(cityName) {
    return cities.value.some(c => c.name.toLowerCase() === cityName.toLowerCase())
  }

  function add(city) {
    if (cities.value.length >= MAX_FAVORITES) return false
    if (!isFavorite(city.name)) {
      cities.value.push(city)
      save()
    }
    return true
  }

  function remove(cityName) {
    cities.value = cities.value.filter(c => c.name.toLowerCase() !== cityName.toLowerCase())
    save()
  }

  return { cities, isFavorite, add, remove, MAX_FAVORITES }
})
