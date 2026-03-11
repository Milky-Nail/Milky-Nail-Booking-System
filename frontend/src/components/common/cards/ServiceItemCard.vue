<template>
  <el-card shadow="hover" class="w-11/12 lg:w-1/4 mx-auto mb-6">
    <template #header>
      <div>
        <slot name="header"></slot>
      </div>
    </template>
    <div class="overflow-hidden rounded-lg">
      <slot name="image"></slot>
    </div>
    <div class="mt-4 font-serif text-md">
      <slot></slot>
    </div>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-card>
</template>
<script setup lang="ts"></script>
