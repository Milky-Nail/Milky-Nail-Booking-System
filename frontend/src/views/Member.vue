<template>
  <section class="min-h-screen flex items-center justify-center">
    <div
      class="bg-white w-full max-w-md rounded-2xl shadow-sm border border-third overflow-hidden"
    >
      <div class="bg-primary px-8 pt-10 pb-14 relative">
        <h2 class="text-white text-xl tracking-widest chiron">個人資料</h2>
        <p class="text-third text-xs mt-1 tracking-wide font-noto">
          管理你的帳號資訊
        </p>
        <div class="absolute -bottom-10 left-8">
          <div
            class="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-secondary"
          >
            <img
              :src="userAvatar"
              alt="avatar"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <form class="px-8 pt-14 pb-8 space-y-5" @submit.prevent="handleSubmit">
        <div class="space-y-1">
          <label
            class="block text-[10px] tracking-[0.15em] uppercase text-primary font-semibold font-noto"
            >姓名</label
          >
          <input
            v-model="form.name"
            type="text"
            placeholder="請輸入姓名"
            class="w-full border-b border-third bg-transparent py-2 text-sm text-gray-700 placeholder:text-gray-300 outline-none focus:border-primary transition-colors duration-200 font-noto"
          />
        </div>

        <div class="space-y-1">
          <label
            class="block text-[10px] tracking-[0.15em] uppercase text-primary font-semibold font-noto"
            >電話</label
          >
          <input
            v-model="form.phone"
            type="text"
            placeholder="09xxxxxxxx"
            class="w-full border-b bg-transparent py-2 text-sm text-gray-700 placeholder:text-gray-300 outline-none transition-colors duration-200 font-noto"
            :class="
              phoneError
                ? 'border-red-400 focus:border-red-400'
                : 'border-third focus:border-primary'
            "
          />
          <p v-if="phoneError" class="text-[11px] text-red-400 font-noto">
            {{ phoneError }}
          </p>
        </div>

        <div class="space-y-1">
          <label
            class="block text-[10px] tracking-[0.15em] uppercase text-primary font-semibold font-noto"
          >
            電子郵件
            <span
              v-if="userGoogleId || userLineId"
              class="text-gray-300 normal-case tracking-normal ml-1"
              >（無法修改）</span
            >
            <span v-else class="text-gray-300 normal-case tracking-normal ml-1"
              >（選填）</span
            >
          </label>
          <input
            v-model="form.email"
            type="text"
            placeholder="填寫 Email 以接收通知"
            :disabled="!!userGoogleId || !!userLineId"
            class="w-full border-b border-third bg-transparent py-2 text-sm text-gray-700 placeholder:text-gray-300 outline-none focus:border-primary transition-colors duration-200 font-noto disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        <div class="pt-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm tracking-widest py-3 rounded-xl transition-all duration-150 font-noto hover:cursor-pointer"
          >
            {{ isLoading ? "更新中..." : "儲存變更" }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const userAvatar = computed(() => userStore.userInfo?.avatar_url as string);
const userGoogleId = computed(() => userStore.userInfo?.google_id);
const userLineId = computed(() => userStore.userInfo?.line_id);
const isLoading = ref(false);
const isUpdating = ref(false);
const phoneError = computed(() => {
  if (!form.value.phone) return "";
  return /^09\d{8}$/.test(form.value.phone)
    ? ""
    : "請輸入正確的手機號碼（09xxxxxxxx）";
});

const form = ref({
  name: userStore.userInfo?.name ?? "",
  phone: userStore.userInfo?.phone ?? "",
  email: userStore.userInfo?.email ?? "",
});
watch(
  () => userStore.userInfo,
  (userInfo) => {
    if (userInfo && !isUpdating.value) {
      form.value = {
        name: userInfo.name ?? "",
        phone: userInfo.phone ?? "",
        email: userInfo.email ?? "",
      };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  if (phoneError.value) return;
  isUpdating.value = true;
  isLoading.value = true;
  try {
    await userStore.updateProfile(form.value);
  } finally {
    isUpdating.value = true;
    isLoading.value = false;
  }
};
</script>
