<template>
  <div class="p-5 max-w-6xl mx-auto font-serif">
    <section class="mb-10">
      <h2 class="text-center mb-6 text-xl font-black">選擇美甲師查看班表</h2>
      <div class="flex gap-4 overflow-x-auto pb-4 justify-center">
        <el-card
          v-for="staff in staffList"
          :key="staff.id"
          class="w-40 shrink-0 cursor-pointer hover:shadow-lg transition-shadow"
          :class="[
            'w-40 shrink-0 cursor-pointer hover:shadow-lg transition-all border-2',
            selectedStaffId === staff.id
              ? 'bg-red-50 border-red-500 shadow-md'
              : 'border-transparent',
          ]"
          :body-style="{ padding: '10px' }"
          @click="scheduleOpen(staff.id)"
        >
          <img
            :src="staff.avatar_url"
            class="w-full h-32 object-cover rounded"
            alt="avatar"
            loading="lazy"
          />
          <div
            class="text-center mt-2 font-black"
            :class="[
              'text-center mt-2 font-black',
              selectedStaffId === staff.id ? 'text-red-600' : '',
            ]"
          >
            {{ staff.name }}
          </div>
          <div class="mt-2">
            <el-button
              :type="selectedStaffId === staff.id ? 'danger' : 'default'"
              size="small"
              class="w-full"
              >查看班表</el-button
            >
          </div>
        </el-card>
      </div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <section class="md:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-black italic border-l-4 border-red-500 pl-2">
            班表清單
          </h3>
        </div>
        <el-scrollbar height="200px" class="border rounded shadow-sm">
          <el-table :data="filteredList" stripe style="width: 100%">
            <el-table-column
              label="日期"
              prop="work_date"
              sortable
              width="120"
            />
            <el-table-column label="上班時間" prop="start_time" sortable>
              <template #default="{ row }">
                <el-tag effect="plain" type="success">
                  {{ row.start_time }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="下班時間" prop="end_time" sortable>
              <template #default="{ row }">
                <el-tag effect="plain" type="info">
                  {{ row.end_time }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="狀態" prop="status">
              <template #default="{ row }">
                <el-tag
                  effect="plain"
                  :type="row.status === 'active' ? 'danger' : 'info'"
                >
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="刪除班表">
              <template #default="{ row }">
                <el-button @click="handleCancel(row)" type="danger"
                  >刪除今日班表</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </section>

      <section>
        <h3
          class="text-lg font-black mb-4 italic border-l-4 border-gray-500 pl-2"
        >
          快速匯入
        </h3>
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          drag
          action="#"
          :http-request="handleUpload"
          :before-upload="beforeExcelUpload"
          :limit="1"
          :on-exceed="handleExceed"
          accept=".xlsx, .xls"
          :show-file-list="true"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text text-xs">拖曳或 <em>點擊上傳</em></div>
          <template #tip>
            <div class="el-upload__tip text-center">
              僅限 .xlsx / .xls / .csv，不超過 5MB
            </div>
          </template>
        </el-upload>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getStaff, type Staff } from "../../../api/staff";
import {
  cancelSchedule,
  getSchedulesByStaff,
  uploadSchedule,
  type ApiResponse,
  type Schedule,
} from "../../../api/schedule";
import { ElMessage, ElMessageBox, genFileId } from "element-plus";
import type {
  UploadInstance,
  UploadProps,
  UploadRawFile,
  UploadRequestOptions,
} from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import type { AxiosError } from "axios";

const staffList = ref<Staff[] | null>([]);
const currentStaffSchedules = ref<Schedule[] | []>([]);
const filteredList = ref<Schedule[] | []>([]);
const loading = ref(true);
const uploadRef = ref<UploadInstance>();
const selectedStaffId = ref<number | null>(null);

onMounted(async () => {
  try {
    const data = await getStaff();
    staffList.value = data;
    if (data && data.length > 0) {
      scheduleOpen(data[0]!.id);
    }
  } finally {
    loading.value = false;
  }
});

const formatTaipei = (isoStr: string | undefined) => {
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

const scheduleOpen = async (staffId: number) => {
  selectedStaffId.value = staffId;
  currentStaffSchedules.value = await getSchedulesByStaff(staffId);
  filteredList.value = currentStaffSchedules.value.map((schedule) => {
    const localStart = formatTaipei(schedule.start_time as string);
    const localEnd = formatTaipei(schedule.end_time as string);
    return {
      staff_id: schedule.staff_id as number,
      work_date: localStart.date,
      start_time: localStart.time,
      end_time: localEnd.time,
      status: schedule.status as "active" | "cancelled",
    };
  });
};

const beforeExcelUpload: UploadProps["beforeUpload"] = (rawFile) => {
  const isExcel =
    rawFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    rawFile.type === "application/vnd.ms-excel";
  const isLt5M = rawFile.size / 1024 / 1024 < 5;

  if (!isExcel) {
    ElMessage.error("檔案格式必須是 Excel!");
    return false;
  }
  if (!isLt5M) {
    ElMessage.error("檔案大小不能超過 5MB!");
    return false;
  }
  return true;
};

const handleExceed: UploadProps["onExceed"] = (files) => {
  uploadRef.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
  uploadRef.value!.submit();
  ElMessage.warning("一次只能上傳一個檔案，已為您替換新檔案");
};

const handleUpload = async (options: UploadRequestOptions) => {
  try {
    const res = await uploadSchedule(options.file);
    ElMessage.success(res.message || "匯入成功！");
    if (selectedStaffId.value) {
      await scheduleOpen(selectedStaffId.value);
    }
    uploadRef.value?.clearFiles();
  } catch (err) {
    const axiosError = err as AxiosError<ApiResponse>;
    const errorData = axiosError.response?.data;
    const errorMsg = errorData?.message || "上傳失敗";
    ElMessage.error(errorMsg);
    if (errorData?.errors) {
      console.table(errorData.errors);
    }
  }
};

const handleCancel = async (row: any) => {
  try {
    // 呼叫 API 前彈窗確認
    await ElMessageBox.confirm(
      "取消班表將導致該時段無法被預約，確定嗎？",
      "警告"
    );
    await cancelSchedule(row.staff_id, row.work_date);
    ElMessage.success("班表已取消");

    if (selectedStaffId.value) {
      await scheduleOpen(selectedStaffId.value);
    }
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : "取消失敗");
  }
};
</script>
