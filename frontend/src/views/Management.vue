<template>
  <section class="md:flex">
    <div
      :class="[
        'flex bg-secondary md:h-dvh md:flex-col md:gap-4 md:justify-start overflow-x-auto transition-all duration-500',
        isCollapsed ? 'md:w-0' : 'md:w-1/7 w-full',
      ]"
    >
      <el-button
        v-for="managemnt in managementList"
        :key="managemnt.name"
        class="flex-1 shrink m-0! min-w-0"
        color="#E8306E"
        size="large"
        @click="changePagination(managemnt.name)"
        :disabled="currentPagination === managemnt.name"
        >{{ managemnt.zh_name }}</el-button
      >
    </div>
    <div class="hidden md:block">
      <span
        @click="toggleSidebar"
        class="material-symbols-outlined hover:cursor-pointer transition-transform duration-500 bg-third rounded-4xl"
        :class="!isCollapsed ? 'rotate-180' : 'rotate-0'"
      >
        chevron_right
      </span>
    </div>
    <div class="m-5" :class="isCollapsed ? 'w-full' : 'w-6/7'">
      <Dashboard v-if="currentPagination === 'dashboard'" />
      <Appointment v-if="currentPagination === 'appointment'" />
      <Membership v-if="currentPagination === 'membership'" />
      <Stylist v-if="currentPagination === 'stylist'" />
      <Gallery v-if="currentPagination === 'gallery'" />
      <Quote v-if="currentPagination === 'quote'" />
    </div>
  </section>
</template>
<script setup lang="ts">
import Appointment from "../components/features/managementSection/Appointment.vue";
import Membership from "../components/features/managementSection/Membership.vue";
import Stylist from "../components/features/managementSection/Stylist.vue";
import Gallery from "../components/features/managementSection/Gallery.vue";
import Dashboard from "../components/features/managementSection/Dashboard.vue";
import Quote from "../components/features/managementSection/Quote.vue";
import { ref } from "vue";

const managementList = [
  { name: "dashboard", zh_name: "管理主頁" },
  { name: "appointment", zh_name: "預約管理" },
  { name: "membership", zh_name: "會員管理" },
  { name: "stylist", zh_name: "美甲師管理" },
  { name: "gallery", zh_name: "當月款式管理" },
  { name: "quote", zh_name: "傳圖詢價管理" },
];

const currentPagination = ref("dashboard");
const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
const changePagination = (name: string) => {
  currentPagination.value = name;
};
</script>
