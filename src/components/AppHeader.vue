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

<style scoped>
.app-header {
  background: #1e3a5f;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header__inner {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 60px;
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.app-header__logo-icon {
  font-size: 1.5rem;
}

.app-header__nav {
  display: flex;
  gap: 4px;
  flex: 1;
}

.app-header__nav-link {
  padding: 6px 18px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  font-weight: 500;
  transition: background 0.18s, color 0.18s;
}

.app-header__nav-link:hover,
.app-header__nav-link--active {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.app-header__lang {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.app-header__lang-btn {
  padding: 4px 10px;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.82rem;
  font-weight: 600;
  transition: background 0.18s, color 0.18s;
}

.app-header__lang-btn:hover,
.app-header__lang-btn--active {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.app-header__lang-sep {
  color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 480px) {
  .app-header__logo-text {
    display: none;
  }

  .app-header__inner {
    gap: 12px;
  }

  .app-header__nav-link {
    padding: 6px 12px;
    font-size: 0.88rem;
  }
}
</style>
