<template>
  <section class="flex flex-col justify-center items-center gap-5">
    <el-date-picker
      placeholder="請選擇日期"
      v-model="selectedDate"
      type="date"
      :disabled-date="disabledDate"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
    ></el-date-picker>
    <div class="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-9">
      <el-button
        v-for="slot in timeSlots"
        :key="slot.time"
        :type="selectedTime?.time === slot.time ? 'danger' : 'default'"
        class="ml-0! w-full hover:bg-secondary! hover:text-primary! hover:border-third!"
        :disabled="!slot.isAvailable"
        @click="handleTimeSelect(slot)"
        >{{ slot.time }}</el-button
      >
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { type Staff } from "../../../api/staff";
import { useTimeSlots } from "../../../composables/DateTimePicker/useTimeSlots";
import { useStaffSchedule } from "../../../composables/DateTimePicker/useStaffSchedule";
import { useAppointments } from "../../../composables/DateTimePicker/useAppointments";

const props = defineProps<{
  stylist: Staff;
}>();
const emits = defineEmits(["update-dateTime"]);

const { selectedDate, disabledDate, currentDayFullInfo } = useStaffSchedule(
  props.stylist
);
const { bookedAppointments, selectedTime, handleTimeSelect } = useAppointments(
  computed(() => props.stylist.id),
  selectedDate,
  currentDayFullInfo,
  emits
);

const { timeSlots } = useTimeSlots(currentDayFullInfo, bookedAppointments);
</script>
