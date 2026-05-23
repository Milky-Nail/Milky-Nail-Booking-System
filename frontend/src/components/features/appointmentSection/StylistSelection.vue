<template>
  <section
    class="flex flex-col justify-start items-center min-h-dvh md:min-h-fit"
  >
    <div class="flex flex-wrap gap-5 justify-center">
      <StylistCard
        v-for="(staff, index) in staffList"
        :key="index"
        @click="chooseStylist(staff)"
        :class="[
          isSelected(staff.name)
            ? 'border-2 border-primary bg-secondary shadow-md transform scale-105'
            : 'opacity-70',
        ]"
      >
        <template #image>
          <img :src="staff.avatar_url" alt="美甲師照片" loading="lazy" />
        </template>
        <template #stylist-name>
          <div>{{ staff.name }}</div>
        </template>
        <template #stylist-caption>
          <div>{{ staff.bio }}</div>
        </template>
      </StylistCard>
    </div>
  </section>
</template>
<script setup lang="ts">
import StylistCard from "../../common/cards/StylistCard.vue";
import { ref, onMounted } from "vue";
import { getStaff, type Staff } from "../../../api/staff";
import { useAppointmentStore } from "../../../stores/appointment";
const staffList = ref<Staff[] | null>([]);
const loading = ref(true);
const chosenStylist = ref<Staff | null>(null);
const appointmentStore = useAppointmentStore();
const emit = defineEmits(["update-stylist"]);

onMounted(async () => {
  try {
    const data = await getStaff();
    staffList.value = data;
  } finally {
    loading.value = false;
  }
});

const chooseStylist = (staff: Staff) => {
  appointmentStore.parentTime = null;
  chosenStylist.value = staff;
  emit("update-stylist", chosenStylist.value);
};

const isSelected = (name: string) => {
  return chosenStylist.value?.name === name;
};
</script>
