<template>
  <RouterLink
    v-for="(item, index) in randomgallery"
    to="/gallery"
    :key="item.id"
    class="group"
    :class="{ 'md:-translate-y-5': index % 2 === 1 }"
  >
    <div
      class="aspect-square rounded-2xl overflow-hidden group cursor-pointer relative after:content-[''] after:absolute after:inset-0 after:bg-primary/50 after:backdrop-blur-sm after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-500"
    >
      <img
        :src="item.image_url"
        alt=""
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <span
          class="bg-white text-primary p-3 rounded-full material-symbols-outlined shadow-lg"
          >visibility</span
        >
      </div>
    </div>
  </RouterLink>
</template>
<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useWorks } from "../../../composables/Gallery/useWorks";

const { workList, fetchWorks } = useWorks();
onMounted(async () => {
  await fetchWorks(true);
});

const randomgallery = computed(() => {
  const data = workList.value?.data ?? [];
  return [...data].sort(() => Math.random() - 0.5).slice(0, 4);
});
</script>
