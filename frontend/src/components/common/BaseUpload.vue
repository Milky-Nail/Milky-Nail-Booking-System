<template>
  <el-upload
    ref="uploadRef"
    :action="uploadUrl"
    :with-credentials="true"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-upload="beforeUpload"
    :limit="limit"
    :list-type="listType"
    :on-remove="handleRemove"
    name="file"
  >
    <!-- el-upload跨域請求不會攜帶 Cookie 所以需要寫with-credentials，不然設中間件會被擋掉-->
    <template #trigger>
      <el-icon class="mr-1"><Plus /></el-icon>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import type { UploadRawFile, UploadInstance } from "element-plus";
import { ref } from "vue";

const uploadRef = ref<UploadInstance>();
const props = defineProps({
  uploadUrl: { type: String, required: true },
  limit: { type: Number, default: 1 },
  listType: { type: String, default: "picture-card" },
});

const emit = defineEmits(["upload-success", "upload-error", "upload-remove"]);
const clear = () => {
  if (uploadRef.value) {
    uploadRef.value.clearFiles();
  }
};
defineExpose({
  clear,
});
const handleSuccess = (res: any) => {
  emit("upload-success", res);
};

const handleError = (error: any) => {
  if (error?.status === 429) {
    ElMessage.error("上傳太頻繁，請稍後再試");
  } else {
    ElMessage.error("上傳失敗，請稍後再試");
  }
  emit("upload-error");
};

const beforeUpload = (rawFile: UploadRawFile) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];
  const isAllowedFormat = allowedTypes.includes(rawFile.type);
  const fileName = rawFile.name.toLowerCase();
  const isHEIC = fileName.endsWith(".heic") || fileName.endsWith(".heif");
  const maxSize = 5;
  const isLtSize = rawFile.size / 1024 / 1024 < maxSize;

  if (!isAllowedFormat && !isHEIC) {
    ElMessage.error("僅支援 JPG, PNG, WebP 或 iPhone HEIC 格式圖片");
    return false;
  }

  if (!isLtSize) {
    ElMessage.warning(
      `照片太大囉 (${(rawFile.size / 1024 / 1024).toFixed(
        1
      )}MB)，請選擇 5MB 以下的照片或先進行截圖再上傳。`
    );
    return false;
  }

  return true;
};
const handleRemove = () => {
  emit("upload-remove");
};
</script>
<style scoped>
:deep(.el-upload--picture-card) {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  width: 148px;
  height: 148px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}
</style>
