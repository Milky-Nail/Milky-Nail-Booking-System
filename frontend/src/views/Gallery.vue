<template>
  <section class="p-4 overflow-hidden">
    <div class="mb-4">
      <div
        class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:justify-center md:flex-wrap"
      >
        <el-button
          type="danger"
          v-for="(tag, index) in tagList"
          :key="index"
          @click="tag === '取消篩選' ? chooseTag(undefined) : chooseTag(tag)"
          :plain="
            tag === '取消篩選' ? selectedTag !== undefined : selectedTag !== tag
          "
          class="shrink-0 ml-0!"
        >
          {{ tag }}
        </el-button>
      </div>
    </div>

    <div class="mb-6">
      <div
        class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:justify-center md:flex-wrap"
      >
        <el-button
          type="danger"
          v-for="(price, index) in priceRange"
          :key="index"
          @click="
            price === undefined ? choosePrice(undefined) : choosePrice(price)
          "
          :plain="selectedPrice !== price"
          class="shrink-0 ml-0!"
        >
          {{ price ? price : "取消篩選" }}
        </el-button>
      </div>
    </div>

    <div
      class="w-full relative mt-10"
      v-if="workList?.data && workList.data.length > 0"
    >
      <swiper
        :key="
          workList.data.length + (selectedTag || '') + (selectedPrice || '')
        "
        :modules="modules"
        :slides-per-view="1.5"
        :centered-slides="true"
        :space-between="30"
        :navigation="true"
        :pagination="{ clickable: true }"
        :breakpoints="{
          '768': { slidesPerView: 3 },
          '1024': { slidesPerView: 5 },
        }"
        class="work-swiper"
      >
        <swiper-slide
          v-for="work in workList.data"
          :key="work.id"
          v-slot="{ isActive }"
        >
          <div
            class="transition-all duration-500 flex flex-col items-center pb-12"
            :class="[
              isActive ? 'scale-110 opacity-100 z-10' : 'scale-90 opacity-40',
            ]"
          >
            <div
              class="w-full aspect-square overflow-hidden rounded-2xl shadow-lg bg-white"
            >
              <img
                :src="work.image_url"
                :alt="work.title"
                class="w-full h-full object-cover"
              />
            </div>
            <p class="mt-4 text-sm font-medium text-gray-700">
              {{ work.title }}
            </p>
            <div class="flex gap-1 mt-1">
              <el-tag
                v-for="(tag, index) in work.tags"
                :key="index"
                type="danger"
                size="small"
                >{{ tag }}</el-tag
              >
            </div>
            <div class="font-bold text-red-500 mt-1">{{ work.price }}</div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useWorks } from "../composables/Gallery/useWorks";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";

const modules = [Navigation, Pagination];

const tagList = ref<string[]>([]);
const priceRange = ref<(number | undefined)[]>([
  1300,
  1400,
  1500,
  1600,
  undefined,
]);

const { workList, selectedTag, selectedPrice, fetchWorks } = useWorks();

onMounted(async () => {
  await fetchWorks();
  if (workList.value?.data) {
    tagList.value = [
      ...new Set(workList.value.data.flatMap((work) => work.tags || [])),
    ];
  }
  tagList.value.push("取消篩選");
});

const chooseTag = async (tag: string | undefined) => {
  selectedTag.value = tag;
  await fetchWorks();
};

const choosePrice = async (price: number | undefined) => {
  selectedPrice.value = price;
  await fetchWorks();
};
</script>

<style scoped>
:deep(.swiper) {
  padding-bottom: 50px !important;
  overflow: visible !important;
}

:deep(.swiper-pagination) {
  bottom: 0px !important;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #f56c6c;
  top: 40%;
}

:deep(.swiper-pagination-bullet-active) {
  background: #f56c6c;
}
</style>
