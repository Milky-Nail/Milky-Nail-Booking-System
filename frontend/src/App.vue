<script setup lang="ts">
import Header from "./components/layout/Header.vue";
import Footer from "./components/layout/Footer.vue";
</script>

<template>
  <Header />
  <main class="mt-20"><router-view /></main>
  <Footer />
</template>

<style scoped></style>
