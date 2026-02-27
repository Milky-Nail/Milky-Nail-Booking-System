<template>
  <div class="bg-secondary pt-10 pb-20">
    <div class="grid grid-cols-1 md:grid-cols-3 w-8/9 mx-auto gap-8">
      <div class="grid grid-rows-2 gap-1.5">
        <div class="flex justify-center md:justify-start items-center gap-1.5">
          <img
            class="w-10 h-10 rounded-full object-cover"
            src="https://scontent.ftpe18-1.fna.fbcdn.net/v/t39.30808-6/573523115_122110019955048436_1801883067112579407_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=s3MyY9j_6UkQ7kNvwGjOy1a&_nc_oc=AdkzKAa6ggMg0h4WZM-aPhZ_OWiV3k8YwpxJLGNET6AOA79gyr-cUUYCg03FpgJ1etA&_nc_zt=23&_nc_ht=scontent.ftpe18-1.fna&_nc_gid=Fzrt1vO31EI4wovgoWpqdA&oh=00_AftOU5V308zBX8v0rRdtjikjrGO2Z2MN-pudLcK0Rus8OQ&oe=69A4FC71"
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
              709臺南市安南區海佃路一段372巷45號1樓
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
  { name: "Gallery", zh: "作品一覽", to: "/gallery" },
  { name: "Notice", zh: "預約須知", to: "/notice" },
  { name: "About", zh: "關於我們", to: "/about" },
];
</script>
