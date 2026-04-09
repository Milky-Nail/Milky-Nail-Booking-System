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
</template>
<script setup lang="ts">
import { ref } from "vue";
import { UPLOAD_URL, type UploadResponse } from "../../../api/uploadImage";
import BaseUpload from "../../common/BaseUpload.vue";
import { uploadWork, type Gallery } from "../../../api/gallery";
import { useUserStore } from "../../../stores/user";

const userStore = useUserStore();
const imageUrl = ref<string>("");
const title = ref<string>("");
const price = ref<number>(0);
const description = ref<string>("");
const tags = ref<string[]>([]);
const imageUploadRef = ref<InstanceType<typeof BaseUpload>>();

const handleWorkImageSuccess = (res: UploadResponse) => {
  imageUrl.value = res.url;
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
  } catch (err) {
    console.error("上傳過程發生錯誤：", err);
    alert(err instanceof Error ? err.message : "上傳失敗");
  }
};
</script>
