<template>
  <section class="p-4">
    <div class="mb-4 flex items-center justify-between">
      <div class="text-2xl font-bold font-serif">預約列表</div>

      <div class="flex items-center gap-2">
        <div>
          選擇區間：
          <el-button type="danger" @click="changeTimeBlock(7)">一週</el-button>
          <el-button type="danger" @click="changeTimeBlock(30)"
            >一個月</el-button
          >
          <el-button type="danger" @click="changeTimeBlock(90)"
            >三個月</el-button
          >
        </div>
        <div>
          <!-- 無障礙設計需要表單欄位元素具有id或name屬性並有label與表單欄位對應，tailwind有sr-only屬性讓label標籤在畫面上隱藏但保留無障礙功能 -->
          <label for="admin-search" class="sr-only">搜尋預約</label>
          <el-input
            id="admin-search"
            v-model="searchQuery"
            placeholder="搜尋會員、美甲師或狀態..."
            clearable
            class="w-64!"
          >
            <template #prefix>
              <span class="material-symbols-outlined text-gray-400"
                >search</span
              >
            </template>
          </el-input>
        </div>

        <el-button @click="clearQuery" circle>
          <span class="material-symbols-outlined text-base">refresh</span>
        </el-button>
      </div>
    </div>
  </section>
  <section>
    <div class="font-serif text-2xl font-bold">
      <el-table :data="filteredList">
        <el-table-column label="日期" prop="date" sortable min-width="100" />
        <el-table-column label="開始時間" prop="startTime" sortable />
        <el-table-column label="結束時間" prop="endTime" sortable />
        <el-table-column label="會員" prop="member" sortable />
        <el-table-column label="美甲師" prop="stylist" sortable />
        <el-table-column label="備註" prop="note" sortable />
        <el-table-column label="預約項目" min-width="150">
          <template #default="{ row }">
            <div class="flex flex-col items-start gap-1">
              <el-tag
                v-for="(item, index) in row.items"
                :key="index"
                size="small"
                type="danger"
              >
                {{ item }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="加購項目" min-width="150">
          <template #default="{ row }">
            <div class="flex flex-col items-start gap-1">
              <el-tag
                v-for="(addon, index) in row.addons"
                :key="index"
                size="small"
                type="danger"
              >
                {{ addon }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="加購數量">
          <template #default="{ row }">
            <div class="flex flex-col items-start gap-1">
              <el-tag
                v-for="(quantity, index) in row.quantity"
                :key="index"
                size="small"
                type="danger"
              >
                {{ quantity }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="金額" prop="total_price" sortable />
        <el-table-column
          label="狀態"
          sortable
          :sort-method="sortByStatus"
          min-width="150"
        >
          <template #default="{ row }">
            <div class="flex items-center gap-1">
              <span
                class="material-symbols-outlined text-base"
                :class="statusMap[row.status]?.color"
              >
                {{ statusMap[row.status]?.icon }}
              </span>
              <el-select
                :id="'status-select-' + row.id"
                v-model="row.status"
                placeholder="請選擇狀態"
                size="small"
                @change="(newStatus:string) => handleStatusChange(row.id, newStatus)"
                :class="statusMap[row.status]?.color"
                :disabled="!['pending', 'confirmed'].includes(row.status)"
              >
                <el-option
                  v-for="(config, key) in statusMap"
                  :key="key"
                  :label="config.label"
                  :value="key"
                >
                  <span
                    class="material-symbols-outlined align-middle"
                    :class="config.color"
                  >
                    {{ config.icon }}
                  </span>
                  <span :class="config.color">{{ config.label }}</span>
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="totalCount"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      class="mt-5"
    />
  </section>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  adminChangeStatus,
  getAppointmentByTime,
  type AppointmentItem,
  type AppointmentList,
} from "../../../api/appointment";
import { ElMessage } from "element-plus";

export interface FilteredList {
  date: string;
  startTime: string;
  endTime: string;
  member: string;
  stylist: string;
  items: AppointmentItem[];
  price: number;
  status: string;
  statusColor: string;
  note: string;
}

const appointmentList = ref<AppointmentList[]>([]);
const searchQuery = ref<string>("");
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const currentDays = ref(7);
const statusMap: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  pending: { label: "待確認", color: "text-orange-500", icon: "hourglass_top" },
  confirmed: { label: "已確認", color: "text-blue-500", icon: "add_ad" },
  completed: {
    label: "已完成",
    color: "text-green-500",
    icon: "playlist_add_check",
  },
  cancelled: {
    label: "已取消",
    color: "text-gray-400",
    icon: "receipt_long_off",
  },
  noshow: { label: "未到場", color: "text-red-500", icon: "visibility_off" },
};

const fetchData = async () => {
  const msOfDay = currentDays.value * 24 * 60 * 60 * 1000;
  const queryDate = new Date(Date.now() - msOfDay);

  try {
    const res = await getAppointmentByTime(
      queryDate,
      false,
      currentPage.value,
      pageSize.value
    );
    if (res) {
      appointmentList.value = res.data;
      totalCount.value = res.pagination.total;
    }
  } catch (err) {
    ElMessage.error("載入資料失敗");
  }
};

const changeTimeBlock = (days: number) => {
  currentDays.value = days;
  currentPage.value = 1;
  fetchData();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchData();
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchData();
};

onMounted(() => fetchData());

const formatTaipei = (isoStr: string | Date | undefined) => {
  if (!isoStr) return { date: "", time: "" };
  try {
    const date = new Date(isoStr);
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const parts = formatter.formatToParts(date);
    const year = parts.find((p) => p.type === "year")?.value || "";
    const month = parts.find((p) => p.type === "month")?.value || "";
    const day = parts.find((p) => p.type === "day")?.value || "";
    const hour = parts.find((p) => p.type === "hour")?.value || "00";
    const minute = parts.find((p) => p.type === "minute")?.value || "00";
    return {
      date: `${year}-${month}-${day}`,
      time: `${hour}:${minute}`,
    };
  } catch (e) {
    return { date: "", time: "" };
  }
};

const filteredList = computed(() => {
  if (!appointmentList.value) return [];

  const formattedData = appointmentList.value.map((appointment) => {
    const localStart = formatTaipei(appointment.start_time);
    const localEnd = formatTaipei(appointment.end_time);

    return {
      ...appointment,
      date: localStart.date,
      startTime: localStart.time,
      endTime: localEnd.time,

      member: appointment.users?.name || "未知會員",
      stylist: appointment.staff?.name || "未指定",
      items:
        appointment.appointment_items?.map((i) => i.service_price?.label) || [],

      addons:
        appointment.appointment_items?.flatMap(
          (item) =>
            item.appointment_addons?.map((a) => a.service_addons?.name || "") ||
            []
        ) || [],
      quantity: appointment.appointment_items?.flatMap(
        (item) => item.appointment_addons?.map((a) => a.quantity || 0) || []
      ),

      price: appointment.total_price,
      status: appointment.status,
    };
  });

  if (!searchQuery.value.trim()) return formattedData;
  const query = searchQuery.value.toLowerCase().trim();

  return formattedData.filter((item) => {
    return (
      item.member.toLowerCase().includes(query) ||
      item.stylist.toLowerCase().includes(query) ||
      statusMap[item.status]?.label.includes(query) ||
      item.items.some((label) => label?.toLowerCase().includes(query)) ||
      item.date.includes(query)
    );
  });
});

const clearQuery = () => {
  searchQuery.value = "";
};

const handleStatusChange = async (id: number, newStatus: string) => {
  try {
    await adminChangeStatus(id, newStatus);
    ElMessage.success({
      message: `狀態已成功更新為：${statusMap[newStatus]?.label}`,
      type: "success",
    });
    await fetchData();
  } catch (error) {
    ElMessage.error("更新失敗，請稍後再試");
    await fetchData();
  }
};
const sortByStatus = (a: FilteredList, b: FilteredList) => {
  const statusOrder = [
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "noshow",
  ];
  return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
};
</script>
