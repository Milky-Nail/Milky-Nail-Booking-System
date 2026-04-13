<template>
  <section class="p-4 font-serif">
    <div class="text-2xl font-bold">傳圖詢價確認</div>
    <div class="flex justify-center items-center gap-5 mt-5">
      <div
        v-for="quote in recentQuoteRequest?.data"
        :key="quote.id"
        class="w-1/4"
      >
        <el-card>
          <template #header>
            <div>會員名稱：{{ quote.users.name }}</div>
            <div>日期：{{ quote.appointments.start_time }}</div>
            <div>選擇美甲師：{{ stylistMap[quote.staff_id] }}</div>
            <div>款式敘述：{{ quote.description }}</div>

            <div class="flex mt-2">
              <span
                class="material-symbols-outlined text-base"
                :class="statusMap[quote.status]?.color"
              >
                {{ statusMap[quote.status]?.icon }}
              </span>
              <el-select
                :id="'status-select-' + quote.id"
                v-model="quote.status"
                placeholder="請選擇狀態"
                size="small"
                @change="(newStatus:string) => handleStatusChange(quote.appointment_id, newStatus)"
                :class="statusMap[quote.status]?.color"
                :disabled="
                  !['pending', 'confirmed'].includes(quote.appointments.status)
                "
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
          <div class="relative w-full aspect-square overflow-hidden">
            <img
              :src="quote.image_url"
              alt="詢價圖片"
              class="absolute w-full h-full object-cover transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
              @click="handleDialogOpen(quote.image_url)"
            />
            <div>
              <el-dialog v-model="centerDialogVisible" center align-center>
                <div class="w-1/2 overflow-hidden mx-auto">
                  <img
                    :src="currentImage"
                    alt="詢價圖片"
                    class="max-w-full max-h-full"
                  />
                </div>
              </el-dialog>
            </div>
          </div>

          <div>
            <div class="mt-2">回傳價格：</div>
            <div class="flex justify-between gap-2 mt-2">
              <el-input
                v-model="quote.quoted_price"
                placeholder="請輸入回傳價格"
                show-word-limit
                word-limit-position="outside"
                type="number"
              />
            </div>
          </div>
          <template #footer>
            報價訊息：
            <el-input
              v-model="quote.staff_reply"
              placeholder="請輸入回傳訊息內容"
              show-word-limit
              word-limit-position="outside"
              type="textarea"
              class="mt-2"
            />
            <el-button
              type="danger"
              class="mt-5"
              @click="
                replyQuote(
                  quote.appointment_id,
                  quote.id,
                  quote.staff_reply,
                  quote.quoted_price
                )
              "
              >確認價格與訊息</el-button
            >
          </template>
        </el-card>
      </div>
    </div>
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="3"
      layout="total, prev, pager, next"
      :total="totalCount"
      @current-change="handlePageChange"
    />
  </section>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  getQuoteRequest,
  updateQuoteRequest,
  type QuoteRequestPagination,
} from "../../../api/quote";
import { adminChangeStatus } from "../../../api/appointment";

const recentQuoteRequest = ref<QuoteRequestPagination | null>(null);
const totalCount = ref(0);
const currentPage = ref(1);
const pageSize = ref(3);
const centerDialogVisible = ref(false);
const currentImage = ref<string>("");
const stylistMap: Record<number, string> = { 1: "阿柔", 2: "嫻嫻" };
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

const fetchQuoteData = async () => {
  try {
    const res = await getQuoteRequest(currentPage.value, pageSize.value);
    recentQuoteRequest.value = res;
    recentQuoteRequest.value.data.map((quote) => {
      quote.appointments.start_time = new Date(
        quote.appointments.start_time
      ).toLocaleString("zh-TW", {
        timeZone: "Asia/Taipei",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    });
    totalCount.value = res.totalCount;
  } catch (err) {
    ElMessage.error("載入資料失敗");
  }
};

onMounted(() => fetchQuoteData());

const handleDialogOpen = (imageUrl: string) => {
  centerDialogVisible.value = true;
  currentImage.value = imageUrl;
};

const handleStatusChange = async (id: number, newStatus: string) => {
  try {
    await adminChangeStatus(id, newStatus);
    ElMessage.success({
      message: `狀態已成功更新為：${statusMap[newStatus]?.label}`,
      type: "success",
    });
    await fetchQuoteData();
  } catch (error) {
    ElMessage.error("更新失敗，請稍後再試");
    await fetchQuoteData();
  }
};

const replyQuote = async (
  appointmentId: number,
  id: number,
  staffReply: string,
  price: number
) => {
  await handleStatusChange(appointmentId, "confirmed");
  await updateQuoteRequest(id, staffReply, price);
  await fetchQuoteData();
};
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchQuoteData();
};
</script>
