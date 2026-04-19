<template>
  <header
    class="main-header fixed inset-x-0 top-0 z-10000 bg-secondary text-white pt-[env(safe-area-inset-top)]"
  >
    <div class="h-20">
      <div class="relative flex h-full items-center justify-between px-4">
        <RouterLink to="/home" class="flex gap-2 items-center">
          <img
            class="w-10 h-10 rounded-full object-cover"
            src="https://res.cloudinary.com/dsjw5wnvg/image/upload//f_auto,q_auto/v1776184355/logo_gxzpph.jpg"
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
          <BaseButton to="/appointment">預約美甲</BaseButton>
          <div
            class="relative"
            @mouseenter="handleMouseEnter()"
            @mouseleave="handleMouseLeave()"
          >
            <button type="button" class="text-black hover:cursor-pointer">
              <img
                class="w-10 h-10 rounded-full object-cover"
                :src="
                  avatarUrl ??
                  'https://res.cloudinary.com/dsjw5wnvg/image/upload//f_auto,q_auto/v1776184355/logo_gxzpph.jpg'
                "
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
import { ref, computed, onMounted } from "vue";
import BaseButton from "../ui/BaseButton.vue";
import DropdownMenu from "../common/DropDownMenu.vue";
import { useUserStore } from "../../stores/user";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  gsap.to(".main-header", {
    backgroundColor: "rgba(247, 235, 239, 0.7)",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
    duration: 0.3,
    scrollTrigger: {
      trigger: "body",
      start: "top -50",
      end: "top -50",
      toggleActions: "play none reverse none",
    },
  });
});

interface NavLink {
  name: string;
  zh: string;
  to: string;
}
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const avatarUrl = computed(() => userStore.userInfo?.avatar_url);
const isMenuOpen = ref(false);
const links: NavLink[] = [
  { name: "Service and Fee", zh: "服務價目", to: "/service-and-fee" },
  { name: "Gallery", zh: "當月款式", to: "/gallery" },
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
