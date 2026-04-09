<template></template>
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { onMounted } from "vue";
import { useUserStore } from "../stores/user";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage({
      showClose: true,
      message: "登入失敗，請重新登入！",
      type: "warning",
      duration: 5000,
    });
    router.push({
      name: "Login",
      query: { redirect: route.fullPath },
    });
    return;
  }
});
</script>
