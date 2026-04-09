<template>
  <section class="p-10">
    <div class="font-serif flex flex-col items-center gap-5">
      <h2 class="text-2xl font-black text-primary">預約紀錄</h2>
      <div class="flex gap-2">
        <div class="font-black">請選擇月份</div>
        <el-date-picker
          v-model="monthValue"
          type="month"
          placeholder="Select month"
          format="YYYY-MM"
          value-format="YYYY-MM"
        />
      </div>
      <p class="text-primary font-black">※取消預約須於七天前取消</p>
    </div>

    <div
      class="font-noto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5"
    >
      <div
        v-for="appointment in filteredAppointments"
        :key="appointment.id"
        class="rounded-2xl shadow-sm border bg-secondary border-primary overflow-hidden p-5 flex flex-col gap-2"
      >
        <div :class="statusColorMap[appointment.status]">
          狀態：{{ statusMap[appointment.status] || appointment.status }}
        </div>

        <div>
          <div class="font-bold text-lg">
            美甲師：{{ appointment.staff.name }}
          </div>
          <div>日期：{{ appointment.start_time.split("T")[0] }}</div>
          <div>
            時間：{{
              Number(appointment.start_time.split("T")[1]?.split(":")[0]) + 8
            }}點{{ appointment.start_time.split("T")[1]?.split(":")[1] }}分
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div
            v-for="(item, index) in appointment.appointment_items"
            :key="item.id"
            class="text-primary border-2 border-secondary p-3 rounded-xl bg-white"
          >
            <div>
              {{ index + 1 }}、{{ item.services?.name }} -
              {{ item.service_price?.label }} (${{ item.price_snapshot }})
            </div>

            <div
              v-if="item.appointment_addons?.length > 0"
              class="ml-6 mt-1 text-sm text-gray-500"
            >
              <div v-for="addon in item.appointment_addons" :key="addon.id">
                + 加購：{{ addon.service_addons?.name }} (${{
                  addon.price_snapshot
                }})
              </div>
            </div>
          </div>
        </div>

        <div class="font-bold flex justify-between items-end mt-auto pt-4">
          <el-popconfirm
            title="確定要取消預約嗎？"
            width="200"
            confirm-button-text="確定取消"
            confirm-button-type="info"
            cancel-button-text="再考慮看看"
            cancel-button-type="danger"
            @confirm="handleCancel(appointment.id)"
          >
            <template #reference>
              <ElButton
                type="danger"
                size="small"
                :disabled="!canCancel(appointment)"
                :loading="loadingId === appointment.id"
                >取消預約</ElButton
              >
            </template>
          </el-popconfirm>
          <div class="text-third text-xl">
            總金額：<span class="text-primary"
              >${{ appointment.total_price }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "../stores/user";
import { useAppointmentStore } from "../stores/appointment";
import {
  userCancelAppointment,
  type UserAppointmentList,
} from "../api/appointment";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const appointmentStore = useAppointmentStore();
const statusMap: Record<string, string> = {
  pending: "待確認",
  confirmed: "已預約",
  completed: "已完成",
  cancelled: "已取消",
  noshow: "未到店",
};
const statusColorMap: Record<string, string> = {
  pending: "text-orange-500",
  confirmed: "text-blue-500",
  completed: "text-green-500",
  cancelled: "text-gray-400",
  noshow: "text-red-500",
};

onMounted(async () => {
  const user = userStore.userInfo;
  await appointmentStore.fetchUserAppointments(user?.id as string);
});

const appointmentList = computed(() => appointmentStore.userAppointments);
const monthValue = ref("");

const filteredAppointments = computed(() => {
  if (!monthValue.value) return [];

  const filtered = appointmentList.value.filter((appointment) => {
    const selectedDate = appointment.start_time.slice(0, 7);
    return selectedDate === monthValue.value;
  });
  return filtered.sort((a, b) => {
    //避免取消預約之後亂跳
    return b.id - a.id;
  });
});

const loadingId = ref<number | null>(null);
const handleCancel = async (id: number) => {
  if (loadingId.value) return;
  try {
    loadingId.value = id;
    await userCancelAppointment(id);
    ElMessage({
      showClose: true,
      message: "取消成功，期待再次預約！",
      type: "success",
      duration: 3000,
    });
    const user = userStore.userInfo;
    await appointmentStore.fetchUserAppointments(user?.id as string);
  } catch (err: any) {
    if (err.response?.status === 401) {
      ElMessage({
        showClose: true,
        message: err.response?.data?.error || "請先登入後操作",
        type: "warning",
        duration: 3000,
      });
    } else {
      ElMessage({
        showClose: true,
        message: err.response?.data?.error || "取消失敗",
        type: "warning",
        duration: 3000,
      });
    }
  } finally {
    loadingId.value = null;
  }
};

const canCancel = (appointment: UserAppointmentList) => {
  const isStatusValid = ["pending", "confirmed"].includes(appointment.status);
  if (!isStatusValid) return false;

  const now = Date.now();
  const startTime = new Date(appointment.start_time).getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const isDateValid = startTime - now > oneWeek;
  return isDateValid;
};
</script>
