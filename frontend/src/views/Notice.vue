<template>
  <div
    class="max-w-md mx-auto my-8 overflow-hidden bg-white border border-rose-100 rounded-2xl shadow-sm"
  >
    <div
      class="flex items-center gap-2 bg-secondary px-6 py-4 border-b border-secondary"
    >
      <span class="material-symbols-outlined text-primary"> error </span>
      <h3 class="text-primary font-bold text-lg flex items-center">
        預約事前須知
      </h3>
    </div>

    <div class="p-6 space-y-4 text-gray-600">
      <div class="flex flex-wrap gap-2 mb-4">
        <span class="bg-gray-100 text-primary text-xs px-2 py-1 rounded"
          >無超厚建構</span
        >
        <span class="bg-gray-100 text-primary text-xs px-2 py-1 rounded"
          >無卸他店延甲</span
        >
        <span class="bg-gray-100 text-primary text-xs px-2 py-1 rounded"
          >無大鑽飾服務</span
        >
      </div>

      <ul class="space-y-3 text-sm leading-relaxed">
        <li class="flex items-start">
          <span class="text-rose-400 mr-2">✦</span>
          <p>
            造型**不能百分之百複製**，手作藝術存在個體差異，<span
              class="text-rose-600 font-medium"
              >完美主義者請勿預約</span
            >。
          </p>
        </li>

        <li class="flex items-start">
          <span class="text-rose-400 mr-2">✦</span>
          <p>
            為維護衛生與安全，<span class="text-rose-600 font-medium"
              >不承接病甲、問題皮膚</span
            >服務。
          </p>
        </li>

        <li class="flex items-start text-gray-500">
          <span class="text-rose-400 mr-2">✦</span>
          <p>無提供貼大鑽飾、卸大鑽飾服務。</p>
        </li>
      </ul>

      <div
        class="mt-6 p-4 bg-stone-50 rounded-lg border border-dashed border-stone-200"
      >
        <p class="text-xs text-stone-500 text-center italic">
          不確定款式或指甲狀況嗎？<br />
          <span class="text-rose-500 font-semibold"
            >歡迎至預約美甲區傳圖詢問呦！</span
          >
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
