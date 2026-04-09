import { ref, watch, type Ref } from "vue";
import { getAppointmentsByStaff, type BookedSlot } from "../../api/appointment";
import { type TimeSlot, type Schedule } from "../../api/schedule";

export function useAppointments(
  stylistId: Ref<number | string>,
  selectedDate: Ref<string>,
  currentDayFullInfo: Ref<Schedule | null | undefined>,
  emits: (
    event: "update-dateTime",
    ...args: {
      date: string;
      time: string;
      fullInfo: Schedule | null | undefined;
    }[]
  ) => void
) {
  const selectedTime = ref<TimeSlot | null>(null);
  const bookedAppointments = ref<BookedSlot[]>([]);

  watch(
    [stylistId, selectedDate],
    async ([id, date]) => {
      if (id && date) {
        try {
          const data = await getAppointmentsByStaff(id as number, date);
          bookedAppointments.value = data;
        } catch (error) {
          console.error("抓取預約資料失敗:", error);
          bookedAppointments.value = [];
        }
      } else {
        bookedAppointments.value = [];
      }
      selectedTime.value = null;
    },
    { immediate: true }
  );

  const handleTimeSelect = (time: TimeSlot) => {
    selectedTime.value = time;
    const dateTimeUpdate = {
      date: selectedDate.value,
      time: time.time,
      fullInfo: currentDayFullInfo.value,
    };
    emits("update-dateTime", dateTimeUpdate);
  };
  return {
    bookedAppointments,
    selectedTime,
    handleTimeSelect,
  };
}
