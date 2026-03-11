<template>
  <el-card
    shadow="hover"
    class="w-11/12 md:w-1/3 mb-6 overflow-hidden"
    :body-style="{ padding: '0px' }"
  >
    <div class="flex flex-col md:flex-row">
      <div class="p-5 w-full md:w-1/2 shrink-0 overflow-hidden">
        <slot name="image"></slot>
      </div>

      <div class="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div class="mb-2 text-gray-800">
            <slot name="header"></slot>
          </div>

          <div class="font-serif text-gray-500 text-md leading-relaxed">
            <slot name="price"></slot>
          </div>
        </div>
        <div class="text-gray-400 mb-2">
          <slot name="footer"></slot>
        </div>
        <el-button
          type="danger"
          size="large"
          plain
          @click="$emit('button-click')"
          ><slot name="button"></slot
        ></el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts"></script>
