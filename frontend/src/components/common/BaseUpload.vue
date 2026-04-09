<template>
  <el-upload
    ref="uploadRef"
    :action="uploadUrl"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-upload="beforeUpload"
    :limit="limit"
    :list-type="listType"
    name="file"
  >
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

const emit = defineEmits(["upload-success", "upload-error"]);
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

const handleError = () => {
  ElMessage.error("上傳失敗，請稍後再試");
  emit("upload-error");
};

const beforeUpload = (rawFile: UploadRawFile) => {
  const isJPGorPNG =
    rawFile.type === "image/jpeg" || rawFile.type === "image/png";
  const isLt2M = rawFile.size / 1024 / 1024 < 2;

  if (!isJPGorPNG) {
    ElMessage.error("只能上傳 JPG 或 PNG 格式圖片");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("圖片大小不能超過 2MB!");
    return false;
  }
  return true;
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
