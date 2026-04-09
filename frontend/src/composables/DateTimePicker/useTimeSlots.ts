import { computed, type Ref } from "vue";
import { type TimeSlot, type Schedule } from "../../api/schedule";
import { type BookedSlot } from "../../api/appointment";

export function useTimeSlots(
  currentDayFullInfo: Ref<Schedule | null | undefined>,
  bookedAppointments: Ref<BookedSlot[]>
) {
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
    const startTotalMs = new Date(
      `${workDate}T${startHHMM}:00+08:00`
    ).getTime();
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
  return {
    timeSlots,
  };
}
