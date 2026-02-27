<template>
  <section>
    <div class="mx-auto flex flex-col gap-4 pt-15">
      <h3
        class="mx-auto font-serif font-black text-[#D95F76] text-xl sm:text-3xl md:text-4xl lg:text-5xl"
      >
        流行風格推薦
      </h3>
      <p
        class="mx-auto font-serif font-black text-primary text-md sm:text-xl md:text-2xl lg:text-3xl"
      >
        從我們的最新作品中汲取靈感
      </p>
      <p
        class="mx-auto font-serif font-black text-primary text-md sm:text-xl md:text-2xl lg:text-3xl mb-15"
      >
        這裡有Milky Nail工作室最受歡迎的款式
      </p>
    </div>
    <div class="w-8/9 mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <GalleryCard />
    </div>
    <div class="flex justify-center mt-5 pb-5">
      <RouterLink
        to="/gallery"
        class="text-primary hover:bg-[#D95F76] hover:text-white transition-bg duration-500 w-fit px-4 py-2 rounded-2xl"
        >看看我們的其他作品
        <span class="material-symbols-outlined text-primary align-bottom">
          arrow_forward
        </span></RouterLink
      >
    </div>
  </section>
</template>
<script setup lang="ts">
import GalleryCard from "../cards/GalleryCard.vue";
</script>
