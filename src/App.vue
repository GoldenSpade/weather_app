<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useLang } from './composables/useLang'

const route = useRoute()
const { locale, setLang } = useLang()
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="container header-inner">
        <div class="logo">
          <span class="logo-icon">⛅</span>
          <span class="logo-text">{{ $t('nav.title') }}</span>
        </div>

        <nav class="main-nav">
          <RouterLink to="/" class="nav-link" :class="{ active: route.path === '/' }">
            {{ $t('nav.home') }}
          </RouterLink>
          <RouterLink to="/favorites" class="nav-link" :class="{ active: route.path === '/favorites' }">
            {{ $t('nav.favorites') }}
          </RouterLink>
        </nav>

        <div class="lang-switcher">
          <button class="lang-btn" :class="{ active: locale === 'en' }" @click="setLang('en')">EN</button>
          <span class="lang-sep">|</span>
          <button class="lang-btn" :class="{ active: locale === 'uk' }" @click="setLang('uk')">UK</button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background: #1e3a5f;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.logo-icon {
  font-size: 1.5rem;
}

.main-nav {
  display: flex;
  gap: 4px;
  flex: 1;
}

.nav-link {
  padding: 6px 18px;
  border-radius: 6px;
  color: rgba(255,255,255,0.8);
  font-size: 0.95rem;
  font-weight: 500;
  transition: background 0.18s, color 0.18s;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255,255,255,0.15);
  color: #fff;
}

.lang-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.lang-btn {
  padding: 4px 10px;
  border-radius: 4px;
  color: rgba(255,255,255,0.7);
  font-size: 0.82rem;
  font-weight: 600;
  transition: background 0.18s, color 0.18s;
}

.lang-btn:hover,
.lang-btn.active {
  background: rgba(255,255,255,0.2);
  color: #fff;
}

.lang-sep {
  color: rgba(255,255,255,0.3);
}

.app-main {
  flex: 1;
  padding: 24px 0;
}

@media (max-width: 480px) {
  .logo-text { display: none; }
  .header-inner { gap: 12px; }
  .nav-link { padding: 6px 12px; font-size: 0.88rem; }
}
</style>
