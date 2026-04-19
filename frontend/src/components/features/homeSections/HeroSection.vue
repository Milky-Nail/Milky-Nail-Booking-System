<template>
  <section>
    <div
      class="bg-[url(https://res.cloudinary.com/dsjw5wnvg/image/upload/f_auto,q_auto,w_1000/v1772124541/close-up-client-manicure-appointment_gtcswk.jpg)] w-9/10 md:h-dvh bg-cover bg-center flex flex-col text-white gap-4 rounded-2xl mx-auto mb-20 transition-transform duration-500 hover:scale-101 mt-10"
    >
      <div
        class="mx-auto my-auto md:ml-10 md:mt-10 flex flex-col gap-8 bg-white/20 backdrop-blur-sm hover:backdrop-blur-md transition-backdrop-blur-md duration-500 rounded-2xl p-6 md:p-10 w-8/9 lg:w-5/6 xl:w-1/2"
      >
        <span
          class="mx-auto md:ml-5 mt-5 font-serif lg:text-2xl md:text-lg text-sm font-bold text-white"
          >打造你的專屬指尖風格</span
        >
        <span
          class="mx-auto md:ml-5 font-serif font-black text-primary text-xl sm:text-3xl md:text-4xl lg:text-5xl"
          >質感美甲・客製設計</span
        >
        <span
          class="mx-auto md:ml-5 font-serif font-black text-[#D95F76] text-xl sm:text-3xl md:text-4xl lg:text-5xl"
          >專業服務 × 舒適體驗</span
        >
        <span
          class="mx-auto md:ml-5 mt-5 font-serif lg:text-2xl md:text-lg text-sm font-bold text-primary bg-[#D95F76]/50 px-4 py-2 rounded-2xl w-fit"
        >
          現在就讓指尖升級你的日常質感
        </span>
        <div class="mx-auto md:ml-5 mb-6 gap-2 flex">
          <BaseButton to="/appointment">預約美甲</BaseButton>
          <BaseButton to="/gallery">選看款式</BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import BaseButton from "../../ui/BaseButton.vue";
</script>
