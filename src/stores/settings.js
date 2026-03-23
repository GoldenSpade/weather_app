import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const lang = ref(localStorage.getItem('weather_lang') || 'en')

  function setLang(value) {
    lang.value = value
    localStorage.setItem('weather_lang', value)
  }

  return { lang, setLang }
})
