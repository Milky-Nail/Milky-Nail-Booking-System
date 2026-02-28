<template>
  <div class="mt-10 flex flex-col lg:flex-row justify-around">
    <el-card
      v-for="service in randomServices"
      :key="service.id"
      shadow="hover"
      class="w-11/12 lg:w-1/4 mx-auto mb-6"
    >
      <template #header>
        <div>
          <span class="font-serif text-xl font-bold">{{ service.title }}</span>
        </div>
      </template>
      <div class="overflow-hidden rounded-lg">
        <img
          :src="service.image"
          alt="示意圖"
          class="w-full aspect-4/3 object-cover transition-all duration-1000 ease-out hover:scale-105"
        />
      </div>
      <p class="mt-4 font-serif text-md">
        {{ service.description }}
      </p>
      <template #footer>
        <div class="flex justify-between items-center">
          <p class="font-serif text-sm">所需時間：約{{ service.duration }}</p>
          <BaseButton :to="service.path">詳細項目</BaseButton>
        </div>
      </template>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import BaseButton from "../../ui/BaseButton.vue";
import { computed } from "vue";

// 之後需要搬到後端
const services = [
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
      "https://res.cloudinary.com/dsjw5wnvg/image/upload/v1772124607/woman-receiving-manicure-from-woman-gloves-mask-beauty-salon-daytime_oqw27a.jpg",
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
      "https://res.cloudinary.com/dsjw5wnvg/image/upload/v1772118591/copy_of_573982087_122109959337048436_5497158202943003421_n_fnxnhd_0bd7c8.jpg",
    duration: "2小時",
    path: "/service/eyelash",
  },
  {
    id: 6,
    title: "不知道寫什麼",
    description: "一接一自然輕盈感，像天生睫毛般捲翹有神",
    image:
      "https://res.cloudinary.com/dsjw5wnvg/image/upload/v1772124541/close-up-client-manicure-appointment_gtcswk.jpg",
    duration: "2小時",
    path: "/service/eyelash",
  },
];

const randomServices = computed(() => {
  // 先複製一份陣列（避免影響原始資料），打亂順序，取前 3 個
  return [...services].sort(() => Math.random() - 0.5).slice(0, 3);
});
</script>
