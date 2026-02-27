<template>
  <header class="fixed inset-x-0 top-0 z-50 bg-secondary text-white">
    <div class="h-20">
      <div class="relative flex h-full items-center justify-between px-4">
        <RouterLink to="/home" class="flex gap-2 items-center">
          <img
            class="w-10 h-10 rounded-full object-cover"
            src="https://scontent.ftpe18-1.fna.fbcdn.net/v/t39.30808-6/573523115_122110019955048436_1801883067112579407_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=s3MyY9j_6UkQ7kNvwGjOy1a&_nc_oc=AdkzKAa6ggMg0h4WZM-aPhZ_OWiV3k8YwpxJLGNET6AOA79gyr-cUUYCg03FpgJ1etA&_nc_zt=23&_nc_ht=scontent.ftpe18-1.fna&_nc_gid=Fzrt1vO31EI4wovgoWpqdA&oh=00_AftOU5V308zBX8v0rRdtjikjrGO2Z2MN-pudLcK0Rus8OQ&oe=69A4FC71"
            alt="logo"
          />
          <h2 class="text-black inline font-black text-3xl">Milky</h2>
          <h2 class="text-primary inline font-black text-3xl">Nail</h2>
        </RouterLink>
        <nav class="md:flex gap-4 justify-center items-center hidden">
          <RouterLink
            v-for="link in links"
            :key="link.name"
            :to="link.to"
            class="group relative flex items-center justify-center text-sm font-medium transition-colors"
          >
            <span
              class="text-black transition-opacity duration-300 group-hover:opacity-0"
              >{{ link.zh }}</span
            >
            <span
              class="absolute text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              {{ link.name }}
            </span>
          </RouterLink>
        </nav>
        <div class="flex items-center justify-end gap-2 lg:gap-4">
          <BaseButton to="/booking">預約美甲</BaseButton>
          <div
            class="relative"
            @mouseenter="handleMouseEnter()"
            @mouseleave="handleMouseLeave()"
          >
            <button type="button" class="text-black hover:cursor-pointer">
              <img
                class="w-10 h-10 rounded-full object-cover"
                src="https://scontent.ftpe18-1.fna.fbcdn.net/v/t39.30808-6/573523115_122110019955048436_1801883067112579407_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=s3MyY9j_6UkQ7kNvwGjOy1a&_nc_oc=AdkzKAa6ggMg0h4WZM-aPhZ_OWiV3k8YwpxJLGNET6AOA79gyr-cUUYCg03FpgJ1etA&_nc_zt=23&_nc_ht=scontent.ftpe18-1.fna&_nc_gid=Fzrt1vO31EI4wovgoWpqdA&oh=00_AftOU5V308zBX8v0rRdtjikjrGO2Z2MN-pudLcK0Rus8OQ&oe=69A4FC71"
                alt="avatar"
              />
            </button>

            <DropdownMenu
              :isMenuOpen="isMenuOpen"
              :isLoggedIn="isLoggedIn"
              :links="links"
              @close="isMenuOpen = false"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseButton from "../ui/BaseButton.vue";
import DropdownMenu from "../common/DropDownMenu.vue";

interface NavLink {
  name: string;
  zh: string;
  to: string;
}
const isLoggedIn = ref(false);
const isMenuOpen = ref(false);
const links: NavLink[] = [
  { name: "Service and Fee", zh: "服務價目", to: "/service-and-fee" },
  { name: "Gallery", zh: "作品一覽", to: "/gallery" },
  { name: "Notice", zh: "預約須知", to: "/notice" },
  { name: "About", zh: "關於我們", to: "/about" },
];

let leaveTimer: ReturnType<typeof setTimeout> | null = null;

const handleMouseEnter = () => {
  if (leaveTimer) clearTimeout(leaveTimer);
  isMenuOpen.value = true;
};
const handleMouseLeave = () => {
  leaveTimer = setTimeout(() => {
    isMenuOpen.value = false;
  }, 200);
};
</script>
