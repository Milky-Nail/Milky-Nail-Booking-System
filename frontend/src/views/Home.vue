<template>
  <div ref="mainContainer">
    <HeroSection />
    <ServiceSection />
    <GallerySection />
  </div>
</template>
<script setup lang="ts">
import HeroSection from "../components/features/homeSections/HeroSection.vue";
import ServiceSection from "../components/features/homeSections/ServiceSection.vue";
import GallerySection from "../components/features/homeSections/GallerySection.vue";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const mainContainer = ref<HTMLElement | null>(null);
let context: gsap.Context;

onMounted(async () => {
  await nextTick();
  if (mainContainer.value) {
    context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("section");

      sections.forEach((section) => {
        const timeLine = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 50%",
            toggleActions: "play none none reverse",
          },
        });
        timeLine.from(section, {
          opacity: 0,
          y: 30,
          duration: 0.6,
        });
      });
    }, mainContainer.value);
  }
});

onUnmounted(() => {
  if (context) context.revert();
});
</script>
