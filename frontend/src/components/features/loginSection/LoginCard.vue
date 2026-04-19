<template>
  <section class="w-full">
    <div
      class="bg-[url(https://res.cloudinary.com/dsjw5wnvg/image/upload/f_auto,q_auto/v1772124541/close-up-client-manicure-appointment_gtcswk.jpg)] min-h-screen bg-cover bg-center flex justify-center items-center text-white transition-transform duration-500 hover:scale-101"
    >
      <div
        class="flex flex-col justify-center items-center gap-8 bg-white/20 backdrop-blur-sm hover:backdrop-blur-md transition-all duration-500 rounded-2xl p-6 md:p-10 w-8/9 lg:w-1/3 xl:w-1/4"
      >
        <h2 class="text-third text-5xl font-serif font-bold">會員登入</h2>

        <div class="text-2xl font-noto font-bold">選擇登入方式</div>
        <div class="flex gap-2">
          <div class="hover:cursor-pointer" @click="loginWithGoogle">
            <font-awesome-icon
              :icon="['fab', 'google']"
              size="2x"
              color="red"
            />
          </div>
          <div class="hover:cursor-pointer" @click="loginWithLine">
            <font-awesome-icon
              :icon="['fab', 'line']"
              size="2x"
              color="green"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { loginWithLine } from "../../../composables/Login/useLineLogin";
import { loginWithGoogle } from "../../../composables/Login/useGoogleLogin";
</script>
