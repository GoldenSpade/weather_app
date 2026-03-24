import './assets/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './locales/i18n'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

// Apply saved theme before first render
import { useThemeStore } from './stores/theme'
useThemeStore(pinia).init()

app.mount('#app')
