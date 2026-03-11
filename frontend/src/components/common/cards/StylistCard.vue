<template>
  <div
    class="group w-full max-w-xs rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center p-5 text-center hover:cursor-pointer hover:bg-secondary"
  >
    <div class="relative w-32 h-32 mb-4">
      <div
        class="w-full h-full rounded-full overflow-hidden ring-4 ring-red-50 ring-offset-2 group-hover:ring-red-100 transition-all duration-300"
      >
        <slot name="image"></slot>
      </div>

      <div
        class="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-sm"
        title="可預約"
      ></div>
    </div>

    <div class="mb-2">
      <h3
        class="text-xl font-bold text-gray-800 tracking-tight group-hover:text-red-500 transition-colors"
      >
        <slot name="stylist-name"></slot>
      </h3>
    </div>

    <div class="text-sm text-gray-500 leading-relaxed italic line-clamp-2 px-2">
      <slot name="stylist-caption"></slot>
    </div>

    <div class="mt-5 w-full">
      <button
        class="w-full py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-medium group-hover:bg-red-500 group-hover:text-white transition-all duration-300 hover:cursor-pointer"
      >
        選擇預約
      </button>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
