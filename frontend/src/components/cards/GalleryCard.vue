<template>
  <RouterLink
    v-for="(item, index) in randomgallery"
    :to="item.path"
    :key="item.id"
    class="group"
    :class="{ 'md:-translate-y-5': index % 2 === 1 }"
  >
    <div
      class="aspect-square rounded-2xl overflow-hidden group cursor-pointer relative after:content-[''] after:absolute after:inset-0 after:bg-primary/50 after:backdrop-blur-sm after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-500"
    >
      <img
        :src="item.image"
        alt=""
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
import { computed, ref } from "vue";

const gallery = [
  {
    id: 1,
    title: "手部凝膠",
    description: "持久且外觀自然的成長效果，可持續長達 4 週",
    image:
      "https://res.cloudinary.com/dsjw5wnvg/image/upload/v1772124607/woman-receiving-manicure-from-woman-gloves-mask-beauty-salon-daytime_oqw27a.jpg",
    duration: "1小時",
    path: "/service/hand-nail",
  },
  {
    id: 2,
    title: "足部深層保養",
    description: "去角質、硬皮處理，搭配保濕精華，重現嬰兒般柔嫩",
    image:
      "https://res.cloudinary.com/dsjw5wnvg/image/upload/v1772118591/copy_of_573982087_122109959337048436_5497158202943003421_n_fnxnhd_0bd7c8.jpg",
    duration: "1.5小時",
    path: "/service/foot-care",
  },
  {
    id: 3,
    title: "睫毛嫁接 (自然款)",
    description: "一接一自然輕盈感，像天生睫毛般捲翹有神",
    image:
      "https://res.cloudinary.com/dsjw5wnvg/image/upload/v1772124541/close-up-client-manicure-appointment_gtcswk.jpg",
    duration: "2小時",
    path: "/service/eyelash",
  },
  {
    id: 4,
    title: "法式指甲",
    description: "一接一自然輕盈感，像天生睫毛般捲翹有神",
    image:
      "https://res.cloudinary.com/dsjw5wnvg/image/upload/v1772118591/copy_of_573982087_122109959337048436_5497158202943003421_n_fnxnhd_0bd7c8.jpg",
    duration: "2小時",
    path: "/service/eyelash",
  },
  {
    id: 5,
    title: "熱蠟除毛",
    description: "一接一自然輕盈感，像天生睫毛般捲翹有神",
    image:
      "https://res.cloudinary.com/dsjw5wnvg/image/upload/v1772124607/woman-receiving-manicure-from-woman-gloves-mask-beauty-salon-daytime_oqw27a.jpg",
    duration: "2小時",
    path: "/service/eyelash",
  },
  {
    id: 6,
    title: "不知道寫什麼",
    description: "一接一自然輕盈感，像天生睫毛般捲翹有神",
    image:
      "https://res.cloudinary.com/dsjw5wnvg/image/upload/v1772124607/woman-receiving-manicure-from-woman-gloves-mask-beauty-salon-daytime_oqw27a.jpg",
    duration: "2小時",
    path: "/service/eyelash",
  },
];

const randomgallery = computed(() => {
  return [...gallery].sort(() => Math.random() - 0.5).slice(0, 4);
});
</script>
