<template>
  <RouterLink
    :to="to"
    @click="$emit('click')"
    class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/70 duration-500"
    ><slot
  /></RouterLink>
</template>
<script setup lang="ts">
defineProps<{
  to: string;
}>();
defineEmits(["click"]);
</script>
