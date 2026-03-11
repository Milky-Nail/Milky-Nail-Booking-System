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
import { ref, onMounted, computed, watch } from "vue";
import { type Staff } from "../../../api/staff";
import { type Schedule } from "../../../api/schedule";
import { getSchedule } from "../../../api/schedule";
import { type TimeSlot } from "../../../api/schedule";
import {
  getAppointmentsByStaff,
  type BookedSlot,
} from "../../../api/appointment";

const scheduleList = ref<Schedule[]>([]);
const selectedDate = ref(""); //綁v-model在el-date-picker
const selectedTime = ref<TimeSlot | null>(null);
const loading = ref(false);
const props = defineProps<{
  stylist: Staff;
}>();
const emits = defineEmits(["update-dateTime"]);
const bookedAppointments = ref<BookedSlot[]>([]);

onMounted(async () => {
  try {
    const scheduleData = await getSchedule();
    scheduleList.value = scheduleData;
  } finally {
    loading.value = false;
  }
});

const currentStylistSchedule = computed(() => {
  if (!scheduleList.value || !props.stylist.id) return [];

  return scheduleList.value
    .filter((item) => props.stylist.id === item.staff_id)
    .map((item) => item.work_date.split("T")[0]);
});

const availableDateSet = computed(() => new Set(currentStylistSchedule.value));

const disabledDate = (time: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formattedDate = `${time.getFullYear()}-${String(
    time.getMonth() + 1 //getMonth() 回傳的數字是 0 到 11，所以要加1不然會錯位一個月
  ).padStart(2, "0")}-${String(time.getDate()).padStart(2, "0")}`;

  return (
    time.getTime() < today.getTime() ||
    !availableDateSet.value.has(formattedDate)
  );
};

const currentDayFullInfo = computed(() => {
  if (!selectedDate.value) return null;
  return scheduleList.value.find(
    (item) =>
      item.staff_id === props.stylist.id &&
      item.work_date.startsWith(selectedDate.value)
  );
});
watch(
  [() => props.stylist.id, () => selectedDate.value],
  async ([selectedStylistId, selectedDate]) => {
    if (selectedStylistId && selectedDate) {
      const data = await getAppointmentsByStaff(
        selectedStylistId,
        selectedDate
      );
      bookedAppointments.value = data;
      console.log(data);

      console.log(selectedStylistId, selectedDate);
      console.log(bookedAppointments.value); //TODO:記得刪
    } else {
      bookedAppointments.value = [];
    }
  },

  { immediate: true }
);

const timeSlots = computed(() => {
  if (!currentDayFullInfo.value) return [];

  const slots = [];
  const workDate = String(currentDayFullInfo.value.work_date).split("T")[0];

  // 從 ISO 字串提取 HH:mm (不理會時區，只拿數字)
  // currentDayFullInfo.value.start_time、currentDayFullInfo.value.end_time格式為2026-03-30T09:00:00.000Z
  const getHHMM = (isoStr: string) => {
    // 將2026-03-30T01:00:00.000Z從T切成兩段，[1]取後面那段
    const timePart = String(isoStr).split("T")[1];
    // timePart.substring(0, 5)會將字串01:00:00.000Z從第0個字元開始取（0~4）字元，在第5字元（:）之前
    return timePart ? timePart.substring(0, 5) : "00:00";
  };

  const startHHMM = getHHMM(String(currentDayFullInfo.value.start_time));
  const endHHMM = getHHMM(String(currentDayFullInfo.value.end_time));

  // 建立絕對的開始與結束時間的毫秒數(強制指定為台灣時間 +08:00).getTime()取絕對毫秒數
  const startTotalMs = new Date(`${workDate}T${startHHMM}:00+08:00`).getTime();
  const endTotalMs = new Date(`${workDate}T${endHHMM}:00+08:00`).getTime();

  const step = 30 * 60 * 1000; //每隔30分鐘一個預約點

  for (let newStart = startTotalMs; newStart < endTotalMs; newStart += step) {
    const currentSlotDate = new Date(newStart);
    const hr = String(currentSlotDate.getHours()).padStart(2, "0");
    const min = String(currentSlotDate.getMinutes()).padStart(2, "0");
    const timeStr = `${hr}:${min}`;

    // 比對已預約清單，.some只要有一個符合就回傳
    const isBooked = (bookedAppointments.value || []).some((booked) => {
      if (!booked.start_time || !booked.end_time) return false;

      // 如果有booked.start_time與booked.end_time，booked.start_time資料庫回傳是格林威治的時間標記Z，而無論 API 回傳什麼格式，只要有時間標記.getTime()會幫忙轉換成絕對毫秒用以比對
      const bookedStart = new Date(booked.start_time).getTime();
      const bookedEnd = new Date(booked.end_time).getTime();

      //如果新的開始時間大於已被預約的開始時間且小於已被預約的結束時間，就是包含在已預約的時間段裡面
      return newStart >= bookedStart && newStart < bookedEnd;
    });

    slots.push({
      date: workDate,
      time: timeStr,
      isAvailable: !isBooked,
    } as TimeSlot);
  }

  return slots;
});
const handleTimeSelect = (time: TimeSlot) => {
  selectedTime.value = time;
  const dateTimeUpdate = {
    date: selectedDate.value,
    time: time.time,
    fullInfo: currentDayFullInfo.value,
  };
  emits("update-dateTime", dateTimeUpdate);
};
</script>
