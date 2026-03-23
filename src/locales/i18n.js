import { createI18n } from 'vue-i18n'
import en from './en'
import uk from './uk'

const savedLang = localStorage.getItem('weather_lang') || 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'en',
  messages: { en, uk },
})

export default i18n
