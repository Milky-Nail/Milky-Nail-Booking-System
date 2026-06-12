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

    // 轉換 UTC/ISO 時間為台北時間 (Asia/Taipei) 的 HH:mm 格式
    const getHHMM = (isoStr: string) => {
      try {
        const date = new Date(isoStr);
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Taipei",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        });
        const parts = formatter.formatToParts(date);
        const hour = parts.find((p) => p.type === "hour")?.value || "00";
        const minute = parts.find((p) => p.type === "minute")?.value || "00";
        return `${hour}:${minute}`;
      } catch (e) {
        return "00:00";
      }
    };

    const startHHMM = getHHMM(String(currentDayFullInfo.value.start_time));
    const endHHMM = getHHMM(String(currentDayFullInfo.value.end_time));

    const startParts = startHHMM.split(":").map(Number);
    const endParts = endHHMM.split(":").map(Number);

    const startHour = startParts[0] ?? 0;
    const startMin = startParts[1] ?? 0;
    const endHour = endParts[0] ?? 0;
    const endMin = endParts[1] ?? 0;

    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;
    const stepMin = 30;

    for (let currentMin = startTotalMin; currentMin < endTotalMin; currentMin += stepMin) {
      const hr = String(Math.floor(currentMin / 60)).padStart(2, "0");
      const min = String(currentMin % 60).padStart(2, "0");
      const timeStr = `${hr}:${min}`;

      // 產生該時段在台北時間的 ISO 格式毫秒數以比對已預約時間
      const slotStartMs = new Date(`${workDate}T${timeStr}:00+08:00`).getTime();

      // 比對已預約清單，.some只要有一個符合就回傳
      const isBooked = (bookedAppointments.value || []).some((booked) => {
        if (!booked.start_time || !booked.end_time) return false;

        // 如果有booked.start_time與booked.end_time，booked.start_time資料庫回傳是格林威治的時間標記Z，而無論 API 回傳什麼格式，只要有時間標記.getTime()會幫忙轉換成絕對毫秒用以比對
        const bookedStart = new Date(booked.start_time).getTime();
        const bookedEnd = new Date(booked.end_time).getTime();

        //如果新的開始時間大於已被預約的開始時間且小於已被預約的結束時間，就是包含在已預約的時間段裡面
        return slotStartMs >= bookedStart && slotStartMs < bookedEnd;
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
