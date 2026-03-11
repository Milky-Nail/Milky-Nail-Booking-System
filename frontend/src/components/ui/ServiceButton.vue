<template>
  <el-button type="danger" round>{{ label }}</el-button>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
