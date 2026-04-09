import { computed, ref, onMounted } from "vue";
import { type Staff } from "../../api/staff";
import { getSchedule, type Schedule } from "../../api/schedule";

export function useStaffSchedule(stylist: Staff) {
  const scheduleList = ref<Schedule[]>([]); //綁v-model在el-date-picker
  const loading = ref(false);
  const selectedDate = ref("");

  const fetchSchedules = async () => {
    try {
      const scheduleData = await getSchedule();
      scheduleList.value = scheduleData;
    } finally {
      loading.value = false;
    }
  };

  onMounted(fetchSchedules);

  const availableDateSet = computed(() => {
    if (!scheduleList.value.length || !stylist.id) return new Set<string>();

    const dates = scheduleList.value
      .filter((item) => item.staff_id === stylist.id)
      .map((item) => item.work_date.split("T")[0]);

    return new Set(dates);
  });

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
        item.staff_id === stylist.id &&
        item.work_date.startsWith(selectedDate.value)
    );
  });
  return {
    selectedDate,
    loading,
    disabledDate,
    currentDayFullInfo,
    refreshSchedules: fetchSchedules,
  };
}
