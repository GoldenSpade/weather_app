<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="app__main">
      <div class="container">
        <RouterView />
      </div>
    </main>
  </div>
</template>
