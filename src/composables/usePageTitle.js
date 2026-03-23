import { watch } from 'vue'
import { useI18n } from 'vue-i18n'

export function usePageTitle(titleKey) {
  const { t, locale } = useI18n()

  watch(locale, () => {
    document.title = t(titleKey)
  }, { immediate: true })
}
