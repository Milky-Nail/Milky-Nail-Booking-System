<template>
  <div class="bg-secondary pt-10 pb-20">
    <div class="grid grid-cols-1 md:grid-cols-3 w-8/9 mx-auto gap-8">
      <div class="grid grid-rows-2 gap-1.5">
        <div class="flex justify-center md:justify-start items-center gap-1.5">
          <img
            class="w-10 h-10 rounded-full object-cover"
            src="https://res.cloudinary.com/dsjw5wnvg/image/upload/v1776184355/logo_gxzpph.jpg"
            alt="logo"
          />
          <h4 class="text-black inline font-black text-3xl">Milky</h4>
          <h4 class="text-primary inline font-black text-3xl">Nail</h4>
        </div>
        <div>
          <p class="font-serif text-center md:text-left">
            以熱情、精準與高品質的護理，重新定義美甲藝術！這裡是屬於您的美甲服務天堂。
          </p>
          <div
            class="flex justify-center items-center md:justify-start mt-5 text-primary"
          >
            <font-awesome-icon :icon="['fab', 'facebook']" size="2x" />
            <font-awesome-icon :icon="['fab', 'instagram']" size="2x" />
          </div>
        </div>
      </div>
      <div class="grid grid-rows-2 gap-1.5 justify-center">
        <p class="font-serif font-bold flex items-center">快速連結</p>
        <div class="font-serif flex flex-col justify-between">
          <RouterLink
            v-for="link in links"
            :key="link.name"
            :to="link.to"
            class="hover:text-primary transition-colors duration-300"
            >{{ link.zh }}</RouterLink
          >
        </div>
      </div>
      <div class="grid grid-rows-2 gap-1.5 justify-center">
        <p class="font-serif font-bold flex items-center justify-center">
          聯絡我們
        </p>
        <div class="font-serif flex flex-col justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary"
              >location_on</span
            >
            <address class="not-italic text-sm">
              <a href="https://reurl.cc/O65EmA" target="blank"
                >709臺南市安南區海佃路一段372巷45號1樓</a
              >
            </address>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">
              phone_enabled
            </span>
            <a href="tel:電話號碼" class="text-sm">（06）0000000</a>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">
              nest_clock_farsight_analog
            </span>
            <p class="text-sm">Mon - Sun 9AM - 6PM</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="text-sm font-serif text-center bg-primary/50">
    © 2026 Milky Nail Art Studio. All rights reserved.
  </div>
</template>
<script setup lang="ts">
interface NavLink {
  name: string;
  zh: string;
  to: string;
}
const links: NavLink[] = [
  { name: "Service and Fee", zh: "服務價目", to: "/service-and-fee" },
  { name: "Gallery", zh: "當月款式", to: "/gallery" },
  { name: "Notice", zh: "預約須知", to: "/notice" },
  { name: "About", zh: "關於我們", to: "/about" },
];
</script>
