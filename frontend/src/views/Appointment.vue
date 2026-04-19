<template>
  <div>
    <ServiceSelection @update-appointment="handleAppointmentUpdate" />
    <button
      type="button"
      v-if="appointmentStore.parentAppointmentList[0]"
      class="my-5 w-full text-center font-chiron text-gray-600 hover:cursor-pointer mb-20 hover:bg-secondary"
      @click="openStylist"
    >
      確認預約項目，下一步！
    </button>
    <div ref="stylistSection" class="scroll-mt-25">
      <StylistSelection
        @update-stylist="handleStylistUpdate"
        v-if="stylistOn && appointmentStore.parentAppointmentList[0]"
        class="mb-20 scroll-mt-20"
      />
    </div>
    <div ref="timeSection" class="pt-20">
      <DateTimePicker
        v-if="appointmentStore.parentStylist"
        :key="appointmentStore.parentStylist.id"
        :stylist="appointmentStore.parentStylist"
        @update-date-time="handleDateTimeUpdate"
      />
    </div>
    <div
      ref="confirmSection"
      v-if="
        appointmentStore.parentAppointmentList &&
        appointmentStore.parentStylist &&
        appointmentStore.parentTime
      "
      class="pt-20"
    >
      <div
        v-for="(item, index) in appointmentStore.parentAppointmentList"
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
          v-if="item.addons?.length"
          class="mt-2 pt-2 border-t border-dashed border-gray-200"
        >
          <div
            v-for="addon in item.addons"
            :key="addon.addon_id"
            class="flex justify-between text-sm text-gray-500"
          >
            <span>+ {{ addon.name }} × {{ addon.quantity }}</span>
            <span>${{ addon.price * addon.quantity }}</span>
          </div>
        </div>
      </div>

      <div class="w-full grid grid-cols-2 gap-3 mt-2">
        <div
          class="bg-primary/15 p-3 rounded-lg text-center border border-gray-100"
        >
          <p class="text-xs text-gray-400 uppercase tracking-wider">Stylist</p>
          <p class="font-medium text-gray-700">
            {{ appointmentStore.parentStylist?.name || "未選擇" }}
          </p>
        </div>
        <div
          class="bg-primary/15 p-3 rounded-lg text-center border border-gray-100"
        >
          <p class="text-xs text-gray-400 uppercase tracking-wider">Time</p>
          <p class="font-medium text-gray-700">
            {{ appointmentStore.parentTime.date }}　{{
              appointmentStore.parentTime?.time || "未選擇"
            }}
          </p>
        </div>
      </div>
      <div
        v-if="hasQuoteService"
        class="mt-6 p-4 bg-white rounded-lg border-2 border-dashed border-primary/30"
      >
        <h3 class="text-md font-bold text-gray-700 mb-3 flex items-center">
          <span class="material-symbols-outlined mr-1">image</span>
          上傳詢價參考圖
        </h3>
        <BaseUpload
          ref="baseUploadRef"
          :upload-url="UPLOAD_URL"
          :limit="1"
          list-type="picture-card"
          @upload-success="handleQuoteImageSuccess"
          @upload-remove="handleQuoteImageRemove"
        />

        <el-input
          v-model="quoteDescription"
          type="textarea"
          :rows="3"
          placeholder="請描述您的需求（例如：顏色、特定鑽飾等）"
          class="mt-4"
        />
      </div>

      <div class="flex justify-center mt-10">
        <el-button
          type="danger"
          :disabled="hasQuoteService && !quoteImageUrl"
          @click="confirm"
        >
          {{ hasQuoteService ? "提交詢價預約" : "確認訂單" }}
        </el-button>
      </div>
    </div>
    <div class="pb-[50vh]"></div>
  </div>
</template>
<script setup lang="ts">
import ServiceSelection from "../components/features/appointmentSection/ServiceSelection.vue";
import StylistSelection from "../components/features/appointmentSection/StylistSelection.vue";
import DateTimePicker from "../components/features/appointmentSection/DateTimePicker.vue";
import { type Select } from "../api/service";
import { type Staff } from "../api/staff";
import { type TimeSlot } from "../api/schedule";
import { ref, nextTick, computed, onMounted } from "vue";
import { createAppointment } from "../api/appointment";
import { type AppointmentData } from "../api/appointment";
import { useUserStore } from "../stores/user";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { useAppointmentStore } from "../stores/appointment";
import BaseUpload from "../components/common/BaseUpload.vue";
import { UPLOAD_URL, type UploadResponse } from "../api/uploadImage";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const appointmentStore = useAppointmentStore();
const stylistOn = ref<Boolean>(false);
const stylistSection = ref<HTMLElement | null>(null);
const timeSection = ref<HTMLElement | null>(null);
const confirmSection = ref<HTMLElement | null>(null);
const userId = computed(() => userStore.userInfo?.id);
const quoteImageUrl = ref<string>("");
const quoteDescription = ref<string>("");
onMounted(() => {
  appointmentStore.clearAll();
});

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
  appointmentStore.parentStylist = data;
  await nextTick(); //確保DOM更新完成，不然滑下去會找不到
  timeSection.value?.scrollIntoView({
    //scrollIntoView只能搭配HTML原生標籤的ref屬性使用
    behavior: "smooth",
    block: "start",
  });
};

const handleDateTimeUpdate = async (data: TimeSlot) => {
  appointmentStore.parentTime = data;
  await nextTick(); //確保DOM更新完成，不然滑下去會找不到
  confirmSection.value?.scrollIntoView({
    //scrollIntoView只能搭配HTML原生標籤的ref屬性使用
    behavior: "smooth",
    block: "center",
  });
};

const end_time = computed(() => {
  if (!appointmentStore.parentTime?.time) return "00:00";
  const [hour, minute] = appointmentStore.parentTime.time
    .split(":")
    .map((item) => Number(item));
  const startTotalMinutes = (hour as number) * 60 + (minute as number);
  const endTotalMinutes = startTotalMinutes + appointmentStore.parentTotalTime;
  const finalHour = Math.floor(endTotalMinutes / 60);
  const finalMin = endTotalMinutes % 60;
  const formattedHour = String(finalHour).padStart(2, "0");
  const formattedMin = String(finalMin).padStart(2, "0");
  return `${formattedHour}:${formattedMin}`;
});

const confirm = async () => {
  if (
    !appointmentStore.parentStylist?.id ||
    !appointmentStore.parentTime?.time
  ) {
    return;
  }

  const fullStartTime = `${appointmentStore.parentTime.date}T${appointmentStore.parentTime.time}:00+08:00`;
  const fullEndTime = `${appointmentStore.parentTime.date}T${end_time.value}:00+08:00`;

  const appointmentData: AppointmentData = {
    user_id: Number(userId.value),
    staff_id: appointmentStore.parentStylist!.id,
    status: "pending",
    start_time: fullStartTime,
    end_time: fullEndTime,
    total_price: appointmentStore.parenTotalAmount,
    note: quoteDescription.value,
    email: userStore.userInfo?.email as string,
    line_id: userStore.userInfo?.line_id as string,

    quote_request: hasQuoteService.value
      ? {
          image_url: quoteImageUrl.value,
          description: quoteDescription.value,
          staff_id: appointmentStore.parentStylist!.id,
          status: "pending",
        }
      : undefined,

    appointment_items: appointmentStore.parentAppointmentList.map((e) => ({
      service_id: e.item.service_id,
      service_price_id: e.item.id,
      price_snapshot: e.item.price,
      duration_snapshot: e.categoryTime,
      appointment_addons: e.addons.map((addon) => ({
        addon_id: addon.addon_id,
        price_snapshot: addon.price,
        duration_snapshot: addon.duration_minutes,
        quantity: addon.quantity,
      })),
    })),
  };
  try {
    if (!userStore.isLoggedIn) {
      ElMessage({
        showClose: true,
        message: "請先登入，登入後請重新選擇服務項目！",
        type: "warning",
        duration: 3000,
      });
      router.push({
        name: "Login",
        query: { redirect: route.fullPath },
      });
      return;
    }

    const response = await createAppointment(appointmentData);
    ElMessage({
      showClose: true,
      message: "預約成功！",
      type: "success",
      duration: 3000,
    });
    console.log("預約成功:", response);
    appointmentStore.clearAll();
    router.push("/order-records");
  } catch (error) {
    ElMessage({
      showClose: true,
      message: "預約失敗",
      type: "error",
      duration: 3000,
    });
    console.error("預約失敗");
  }
};

const handleAppointmentUpdate = (data: Select[]) => {
  appointmentStore.parentAppointmentList = data;
  if (data.length === 0) {
    appointmentStore.parentTime = null;
    appointmentStore.parentStylist = null;
    stylistOn.value = false;
  }
};

const hasQuoteService = computed(() => {
  return appointmentStore.parentAppointmentList.some(
    (item) => item.item.service_id === 8
  );
});

const handleQuoteImageSuccess = (res: UploadResponse) => {
  quoteImageUrl.value = res.url;
};
const handleQuoteImageRemove = () => {
  quoteImageUrl.value = "";
};
</script>
