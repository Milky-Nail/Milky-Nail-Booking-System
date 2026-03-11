<script setup lang="ts">
import Header from "./components/layout/Header.vue";
import Footer from "./components/layout/Footer.vue";
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="mt-20 flex-1"><router-view /></main>
    <footer class="z-100">
      <Footer />
    </footer>
  </div>
</template>

<style scoped></style>
