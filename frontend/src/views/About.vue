<template>
  <section class="max-w-6xl mx-auto px-4 py-16 bg-secondary/20">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div class="relative group">
        <Swiper
          v-if="workList?.data?.length"
          :slidesPerView="1"
          :spaceBetween="0"
          :pagination="false"
          :navigation="false"
          :loop="(workList?.data?.length ?? 0) > 1"
          :autoplay="{
            delay: 3500,
            disableOnInteraction: false,
          }"
          :modules="modules"
          class="rounded-2xl overflow-hidden isolate"
        >
          <swiper-slide v-for="work in workList?.data" :key="work.id">
            <div class="aspect-square w-full">
              <img
                :src="work.image_url"
                :alt="work.title"
                class="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
          </swiper-slide>
        </Swiper>
        <div
          class="absolute -bottom-6 -right-6 w-32 h-32 bg-third -z-10 rounded-2xl"
        ></div>
      </div>

      <div class="space-y-6">
        <div>
          <span
            class="text-rose-400 font-medium tracking-widest uppercase text-sm font-sans"
            >About Milky Nail</span
          >
          <h2 class="text-3xl font-bold text-stone-800 mt-2 tracking-tight">
            用細節，呵護每一雙手
          </h2>
        </div>

        <div class="space-y-4 text-stone-600 leading-relaxed">
          <p>
            我們相信指甲不僅是色彩的裝飾，更是自信的延伸。<br />在
            <strong>Milky Nail</strong
            >，我們專注於純淨、溫柔的視覺表達。<br />一起與<strong
              >Milky Nail</strong
            >在指尖塑造屬於自己的銀河。
          </p>
          <p>
            從基礎的甲面保養到細膩的造型設計，我們堅持不趕時間、不傷甲面的原則，讓您在忙碌的生活中，擁有專屬於自己的寧靜時光。
          </p>
        </div>

        <ul class="grid grid-cols-2 gap-4 border-t border-stone-200 pt-6">
          <li class="flex items-center text-sm text-stone-500">
            <span class="w-2 h-2 bg-rose-300 rounded-full mr-2"></span>
            日本 JNA 衛生管理士
          </li>
          <li class="flex items-center text-sm text-stone-500">
            <span class="w-2 h-2 bg-rose-300 rounded-full mr-2"></span>
            嚴選日本/韓國進口膠
          </li>
          <li class="flex items-center text-sm text-stone-500">
            <span class="w-2 h-2 bg-rose-300 rounded-full mr-2"></span>
            三年資深施作經驗
          </li>
          <li class="flex items-center text-sm text-stone-500">
            <span class="w-2 h-2 bg-rose-300 rounded-full mr-2"></span>
            專注手繪暈染設計
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useWorks } from "../composables/Gallery/useWorks";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
const modules = [Navigation, Pagination, Autoplay];
const { workList, fetchWorks } = useWorks();
onMounted(async () => {
  await fetchWorks(true);
});
</script>
