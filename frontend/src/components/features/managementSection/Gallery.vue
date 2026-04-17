<template>
  <section>
    <div
      class="mt-6 p-4 bg-white rounded-lg border-2 border-dashed border-primary/30"
    >
      <h3 class="text-md font-bold text-gray-700 mb-3 flex items-center">
        <span class="material-symbols-outlined mr-1">image</span>
        上傳當月款式照片
      </h3>
      <BaseUpload
        ref="imageUploadRef"
        :upload-url="UPLOAD_URL"
        :limit="1"
        list-type="picture-card"
        @upload-success="handleWorkImageSuccess"
      />
      <el-input
        v-model="title"
        type="text"
        :rows="3"
        placeholder="作品標題"
        class="mt-4"
      />
      <el-input
        v-model="price"
        type="number"
        :rows="3"
        placeholder="價格"
        class="mt-4"
      />
      <el-input
        v-model="description"
        type="textarea"
        :rows="3"
        placeholder="作品描述"
        class="mt-4"
      />
      <el-select
        v-model="tags"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="請輸入標籤並按 Enter"
        class="mt-4"
        style="width: 100%"
      >
      </el-select>
    </div>
    <div class="flex justify-center mt-10">
      <el-button
        type="danger"
        :disabled="!title || !price || !description || !imageUrl"
        @click="upload"
      >
        確認上傳
      </el-button>
    </div>
  </section>
  <section class="p-4">
    <div class="flex flex-row gap-4 mb-6">
      <div
        v-for="work in currentPageData"
        :key="work.id"
        class="w-1/3 shrink-0"
      >
        <el-card shadow="hover" :body-style="{ padding: '0px' }" class="h-full">
          <div class="h-48 w-full overflow-hidden">
            <img
              :src="work.image_url"
              alt="work image"
              class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div class="p-4">
            <h3 class="text-lg font-bold mb-2 truncate text-gray-800">
              {{ work.title }}
            </h3>

            <div class="flex flex-wrap gap-2">
              <el-tag
                type="danger"
                v-for="(tag, index) in work.tags"
                :key="index"
                size="small"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-between">
              <el-button
                type="danger"
                :disabled="work.is_showed"
                @click="handleShowing(work.id, true)"
                >上架</el-button
              >
              <el-button
                type="danger"
                :disabled="!work.is_showed"
                @click="handleShowing(work.id, false)"
                >隱藏</el-button
              >
            </div>
          </template>
        </el-card>
      </div>
    </div>

    <div class="flex justify-center mt-8">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="workList?.data?.length || 0"
        background
      />
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { UPLOAD_URL, type UploadResponse } from "../../../api/uploadImage";
import BaseUpload from "../../common/BaseUpload.vue";
import {
  uploadWork,
  getWorks,
  type Gallery,
  type WorkResponse,
  showWorkOrNot,
} from "../../../api/gallery";
import { useUserStore } from "../../../stores/user";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const imageUrl = ref<string>("");
const title = ref<string>("");
const price = ref<number>(0);
const description = ref<string>("");
const tags = ref<string[]>([]);
const imageUploadRef = ref<InstanceType<typeof BaseUpload>>();
const workList = ref<WorkResponse | null>(null);
const currentPage = ref(1);
const pageSize = 3;
const currentPageData = computed(() => {
  const data = workList.value?.data || [];
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
});

const fetchWorks = async () => {
  const res = await getWorks({
    tag: undefined,
    price: undefined,
    pagination: { page: undefined, limit: undefined },
  });
  workList.value = res;
};
onMounted(async () => {
  await fetchWorks();
});

const handleWorkImageSuccess = (res: UploadResponse) => {
  imageUrl.value = res.url;
};

const handleShowing = async (id: string, status: boolean) => {
  await showWorkOrNot(id, status);
  ElMessage.success("狀態更改成功！");
  fetchWorks();
};
const upload = async () => {
  if (!title.value || !price.value || !description.value || !imageUrl.value) {
    return;
  }
  const data: Gallery = {
    image_url: imageUrl.value,
    title: title.value,
    price: Number(price.value),
    description: description.value,
    tags: tags.value,
  };
  try {
    if (userStore.userInfo?.role !== "admin") {
      throw new Error("未授權的使用者");
    }
    await uploadWork(data);
    imageUrl.value = "";
    title.value = "";
    price.value = 0;
    description.value = "";
    tags.value = [];
    imageUploadRef.value?.clear();
    fetchWorks();
    ElMessage.success("上傳成功！");
  } catch (err) {
    console.error("上傳過程發生錯誤：", err);
    alert(err instanceof Error ? err.message : "上傳失敗");
  }
};
</script>
