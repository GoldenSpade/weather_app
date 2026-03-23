<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { useLang } from '../composables/useLang'

const route = useRoute()
const { locale, setLang } = useLang()
</script>

<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <div class="app-header__logo">
        <span class="app-header__logo-icon">⛅</span>
        <span class="app-header__logo-text">{{ $t('nav.title') }}</span>
      </div>

      <nav class="app-header__nav">
        <RouterLink
          to="/"
          class="app-header__nav-link"
          :class="{ 'app-header__nav-link--active': route.path === '/' }"
        >
          {{ $t('nav.home') }}
        </RouterLink>
        <RouterLink
          to="/favorites"
          class="app-header__nav-link"
          :class="{ 'app-header__nav-link--active': route.path === '/favorites' }"
        >
          {{ $t('nav.favorites') }}
        </RouterLink>
      </nav>

      <div class="app-header__lang">
        <button
          class="app-header__lang-btn"
          :class="{ 'app-header__lang-btn--active': locale === 'en' }"
          @click="setLang('en')"
        >EN</button>
        <span class="app-header__lang-sep">|</span>
        <button
          class="app-header__lang-btn"
          :class="{ 'app-header__lang-btn--active': locale === 'uk' }"
          @click="setLang('uk')"
        >UK</button>
      </div>
    </div>
  </header>
</template>
