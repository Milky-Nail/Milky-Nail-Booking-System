<template>
  <div
    v-if="isMenuOpen"
    @click="close"
    class="md:absolute md:right-1 md:mt-4 md:w-48 md:top-auto md:left-auto bg-secondary rounded-md shadow-lg py-2 z-50 fixed left-0 top-20 w-full"
  >
    <template v-if="isLoggedIn">
      <MenuItem to="/member">會員中心</MenuItem>
      <MenuItem to="/order-records">訂單紀錄</MenuItem>
      <MenuItem to="/management" v-if="isAdmin">管理中心</MenuItem>
    </template>

    <MenuItem
      v-for="link in links"
      :key="link.name"
      :to="link.to"
      class="md:hidden"
    >
      {{ link.zh }}
    </MenuItem>
    <template v-if="!isLoggedIn">
      <MenuItem to="/login">登入</MenuItem>
    </template>
    <button
      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-primary/70 transition-colors duration-500 hover:cursor-pointer"
      type="button"
      v-if="isLoggedIn"
      @click="handleLogout"
    >
      登出
    </button>
  </div>
</template>
<script setup lang="ts">
import MenuItem from "./MenuItem.vue";
import { useUserStore } from "../../stores/user";
import { computed } from "vue";

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const isAdmin = computed(() => {
  return userStore.userInfo?.role === "admin";
});
const handleLogout = userStore.logout;

defineProps<{
  isMenuOpen: boolean;
  isLoggedIn: boolean;
  links: { name: string; to: string; zh: string }[];
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const close = () => {
  emit("close");
};
</script>
