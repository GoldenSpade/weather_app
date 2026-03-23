import { useI18n } from 'vue-i18n'

export function useLang() {
  const { locale } = useI18n()

  function setLang(lang) {
    locale.value = lang
    localStorage.setItem('weather_lang', lang)
  }

  return { locale, setLang }
}
