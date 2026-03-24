import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('weather_theme') === 'night')

  function init() {
    document.documentElement.setAttribute('data-theme', isDark.value ? 'night' : 'day')
  }

  function toggle() {
    isDark.value = !isDark.value
    const theme = isDark.value ? 'night' : 'day'
    localStorage.setItem('weather_theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }

  return { isDark, toggle, init }
})
