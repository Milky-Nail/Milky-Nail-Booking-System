<template>
  <ServiceSelection
    @update-appointment="handleAppointmentUpdate"
    @update-duration="handleDurationChange"
    @update-amount="handleAmountChange"
  />
  <button
    type="button"
    v-if="parentAppointmentList[0]"
    class="my-5 w-full text-center font-chiron text-gray-600 hover:cursor-pointer mb-20 hover:bg-secondary"
    @click="openStylist"
  >
    選擇美甲師
  </button>
  <div ref="stylistSection" class="scroll-mt-25">
    <StylistSelection
      @update-stylist="handleStylistUpdate"
      v-if="stylistOn && parentAppointmentList[0]"
      class="mb-20 scroll-mt-20"
    />
  </div>
  <div ref="timeSection" class="pt-20">
    <DateTimePicker
      v-if="parentStylist"
      :stylist="parentStylist"
      @update-date-time="handleDateTimeUpdate"
    />
  </div>
  <div
    ref="confirmSection"
    v-if="parentAppointmentList && parentStylist && parentTime"
    class="pt-20"
  >
    <div
      v-for="(item, index) in parentAppointmentList"
      :key="index"
      class="w-full bg-primary/15 p-4 rounded-lg border border-gray-100 shadow-sm"
    >
      <div class="flex justify-between items-start mb-2">
        <span
          class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded"
        >
          {{ item.categoryName }}
        </span>
        <span class="font-mono font-bold text-gray-800">
          ${{ item.item.price }}
        </span>
      </div>

      <div class="text-lg font-semibold text-gray-700">
        {{ item.item.label }}
      </div>

      <div
        v-if="item.addon"
        class="mt-2 pt-2 border-t border-dashed border-gray-200 flex justify-between text-sm text-gray-500"
      >
        <span>+ {{ item.addon.name }}</span>
        <span>${{ item.addon.price }}</span>
      </div>
    </div>

    <div class="w-full grid grid-cols-2 gap-3 mt-2">
      <div
        class="bg-primary/15 p-3 rounded-lg text-center border border-gray-100"
      >
        <p class="text-xs text-gray-400 uppercase tracking-wider">Stylist</p>
        <p class="font-medium text-gray-700">
          {{ parentStylist?.name || "未選擇" }}
        </p>
      </div>
      <div
        class="bg-primary/15 p-3 rounded-lg text-center border border-gray-100"
      >
        <p class="text-xs text-gray-400 uppercase tracking-wider">Time</p>
        <p class="font-medium text-gray-700">
          {{ parentTime.date }}　{{ parentTime?.time || "未選擇" }}
        </p>
      </div>
    </div>
    <div class="flex justify-center mt-20">
      <el-button type="danger" @click="confirm">確認訂單</el-button>
    </div>
  </div>
  <div class="pb-[50vh]"></div>
</template>
<script setup lang="ts">
import ServiceSelection from "../components/features/appointmentSection/ServiceSelection.vue";
import StylistSelection from "../components/features/appointmentSection/StylistSelection.vue";
import DateTimePicker from "../components/features/appointmentSection/DateTimePicker.vue";
import { type Select } from "../api/service";
import { type Staff } from "../api/staff";
import { type TimeSlot } from "../api/schedule";
import { ref, nextTick, computed } from "vue";
import { createAppointment } from "../api/appointment";
import { type AppointmentData } from "../api/appointment";

const stylistOn = ref<Boolean>(false);
const parentAppointmentList = ref<Select[]>([]);
const parentStylist = ref<Staff | null>(null);
const parentTime = ref<TimeSlot | null>(null);
const stylistSection = ref<HTMLElement | null>(null);
const timeSection = ref<HTMLElement | null>(null);
const confirmSection = ref<HTMLElement | null>(null);
const userId = ref(1); //TODO:假的，等登入做完再換掉
const parentTotalTime = ref(0);
const parenTotalAmount = ref(0);

const handleAppointmentUpdate = (data: Select[]) => {
  console.log("接收到子組件傳來的預約項目資料：", data); //TODO:記得刪掉
  parentAppointmentList.value = data;
  stylistOn.value = false;
};

const openStylist = async () => {
  stylistOn.value = true;
  await nextTick(); //確保DOM更新完成，不然滑下去會找不到
  stylistSection.value?.scrollIntoView({
    //scrollIntoView只能搭配HTML原生標籤的ref屬性使用
    behavior: "smooth",
    block: "start",
  });
};

const handleStylistUpdate = async (data: Staff) => {
  console.log("接收到子組件傳來的美甲師資料：", data); //TODO:記得刪掉
  parentStylist.value = data;
  await nextTick(); //確保DOM更新完成，不然滑下去會找不到
  timeSection.value?.scrollIntoView({
    //scrollIntoView只能搭配HTML原生標籤的ref屬性使用
    behavior: "smooth",
    block: "start",
  });
};

const handleDateTimeUpdate = async (data: TimeSlot) => {
  console.log("接收到子組件傳來的預約時間資料：", data); //TODO:記得刪掉
  parentTime.value = data;
  await nextTick(); //確保DOM更新完成，不然滑下去會找不到
  confirmSection.value?.scrollIntoView({
    //scrollIntoView只能搭配HTML原生標籤的ref屬性使用
    behavior: "smooth",
    block: "center",
  });
};

const handleDurationChange = (val: number) => {
  parentTotalTime.value = val;
};

const handleAmountChange = (val: number) => {
  parenTotalAmount.value = val;
};

const end_time = computed(() => {
  if (!parentTime.value?.time) return "00:00";
  const [hour, minute] = parentTime.value.time
    .split(":")
    .map((item) => Number(item));
  const startTotalMinutes = (hour as number) * 60 + (minute as number);
  const endTotalMinutes = startTotalMinutes + parentTotalTime.value;
  const finalHour = Math.floor(endTotalMinutes / 60);
  const finalMin = endTotalMinutes % 60;
  const formattedHour = String(finalHour).padStart(2, "0");
  const formattedMin = String(finalMin).padStart(2, "0");
  return `${formattedHour}:${formattedMin}`;
});

const confirm = async () => {
  if (!parentStylist.value?.id) {
    alert("請選擇設計師");
    return;
  }
  if (!parentTime.value?.time) {
    alert("請選擇預約時間");
    return;
  }
  const fullStartTime = `${parentTime.value.date}T${parentTime.value.time}:00+08:00`;
  const fullEndTime = `${parentTime.value.date}T${end_time.value}:00+08:00`;
  const appointmentData: AppointmentData = {
    user_id: userId.value,
    staff_id: parentStylist.value!.id,
    status: "pending",
    start_time: fullStartTime,
    end_time: fullEndTime,
    total_price: parenTotalAmount.value,
    note: "",

    items: parentAppointmentList.value.map((e) => ({
      service_id: e.item.service_id,
      service_price_id: e.item.id,
      price_snapshot: e.item.price,
      duration_snapshot: e.categoryTime,
    })),

    addons: parentAppointmentList.value
      .filter((e) => e.addon)
      .map((e) => ({
        addon_id: e.addon!.id,
        price_snapshot: e.addon!.price,
        duration_snapshot: e.addon!.duration_minutes,
      })),
  };
  try {
    const response = await createAppointment(appointmentData);
    console.log("預約成功:", response);
  } catch (error) {
    console.error("預約失敗");
  }
};
</script>
