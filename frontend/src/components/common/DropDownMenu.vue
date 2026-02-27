<template>
  <div
    v-if="isMenuOpen"
    @click="close"
    class="md:absolute md:right-1 md:mt-4 md:w-48 md:top-auto md:left-auto bg-secondary rounded-md shadow-lg py-2 z-50 fixed left-0 top-20 w-full"
  >
    <template v-if="isLoggedIn">
      <MenuItem to="/profile">會員中心</MenuItem>
      <MenuItem to="/settings">訂單紀錄</MenuItem>
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
      <MenuItem to="/register">註冊</MenuItem>
    </template>
    <MenuItem v-if="isLoggedIn" to="/logout">登出</MenuItem>
  </div>
</template>
<script setup lang="ts">
import MenuItem from "./MenuItem.vue";

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
