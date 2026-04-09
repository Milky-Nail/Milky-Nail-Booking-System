<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <!-- <main class="mt-20 flex-1"><router-view /></main> -->
    <main class="mt-20 flex-1">
      <router-view v-slot="{ Component, route }">
        <transition
          mode="out-in"
          :css="false"
          @enter="onEnter"
          @leave="onLeave"
        >
          <component :is="Component" :key="route.fullPath" />
        </transition>
      </router-view>
    </main>
    <footer class="z-100">
      <Footer />
    </footer>
  </div>
</template>

<style scoped></style>
<script setup lang="ts">
import Header from "./components/layout/Header.vue";
import Footer from "./components/layout/Footer.vue";
import { onMounted } from "vue";
import { useUserStore } from "./stores/user";
import { gsap } from "gsap";

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchUserProfile();
});

const onEnter = (el: Element, done: () => void): void => {
  gsap.from(el as HTMLElement, {
    opacity: 0,
    x: -10,
    duration: 0.4,
    ease: "power2.out",
    onComplete: done,
  });
};

const onLeave = (el: Element, done: () => void): void => {
  gsap.to(el as HTMLElement, {
    opacity: 0,
    x: 20,
    duration: 0.3,
    ease: "power2.in",
    onComplete: done,
  });
};
</script>
