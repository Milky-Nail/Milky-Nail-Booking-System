<template>
  <section class="p-4 font-serif">
    <div class="text-2xl font-bold">傳圖詢價確認</div>
    <div class="flex flex-wrap justify-center items-center gap-5 mt-5">
      <div
        v-for="quote in recentQuoteRequest?.data"
        :key="quote.id"
        class="w-full md:w-1/3 lg:w-1/4"
      >
        <el-card>
          <template #header>
            <div>會員名稱：{{ quote.users?.name || '未知顧客' }}</div>
            <div>日期：{{ quote.appointments?.start_time || '無關聯預約' }}</div>
            <div>選擇美甲師：{{ stylistMap[quote.staff_id] || '未指定' }}</div>
            <div>款式敘述：{{ quote.description || '無' }}</div>

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
                  !quote.appointments ||
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
              loading="lazy"
              @click="handleDialogOpen(quote.image_url)"
            />
            <div>
              <el-dialog v-model="centerDialogVisible" center align-center>
                <div class="w-1/2 overflow-hidden mx-auto">
                  <img
                    :src="currentImage"
                    alt="詢價圖片"
                    class="max-w-full max-h-full"
                    loading="lazy"
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
    if (res?.data) {
      res.data.forEach((quote) => {
        if (quote.appointments?.start_time) {
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
        }
      });
    }
    recentQuoteRequest.value = res;
    totalCount.value = res?.totalCount || 0;
  } catch (err) {
    console.error("載入資料失敗:", err);
    ElMessage.error("載入資料失敗");
  }
};

onMounted(() => fetchQuoteData());

const handleDialogOpen = (imageUrl: string) => {
  centerDialogVisible.value = true;
  currentImage.value = imageUrl;
};

const handleStatusChange = async (
  id: number | string | null | undefined,
  newStatus: string
) => {
  if (!id) {
    ElMessage.warning("此詢價未關聯有效預約，無法更改預約狀態");
    return;
  }
  try {
    await adminChangeStatus(Number(id), newStatus);
    ElMessage.success(`狀態已成功更新為：${statusMap[newStatus]?.label}`);
    await fetchQuoteData();
  } catch (error) {
    ElMessage.error("更新失敗，請稍後再試");
    await fetchQuoteData();
  }
};

const replyQuote = async (
  appointmentId: number | string | null | undefined,
  id: number | string,
  staffReply: string,
  price: number
) => {
  if (!price || Number(price) <= 0) {
    ElMessage.warning("請輸入大於0的有效價格");
    return;
  }
  if (!staffReply || !staffReply.trim()) {
    ElMessage.warning("請輸入回傳訊息內容");
    return;
  }

  try {
    if (appointmentId) {
      await adminChangeStatus(Number(appointmentId), "confirmed");
    }
    await updateQuoteRequest(id, staffReply, price);
    ElMessage.success("報價與狀態已成功送出！");
    await fetchQuoteData();
  } catch (error) {
    console.error("回覆詢價失敗:", error);
    ElMessage.error("回覆失敗，請稍後再試");
    await fetchQuoteData();
  }
};
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchQuoteData();
};
</script>
