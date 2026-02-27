<template>
  <RouterLink
    :to="to"
    class="text-white text-sm font-medium bg-primary py-2 px-3 hover:bg-primary/70 duration-500 rounded-4xl"
    ><slot
  /></RouterLink>
</template>
<script setup lang="ts">
defineProps<{
  to: string;
}>();
</script>
