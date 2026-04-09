import { defineStore } from "pinia";
import {
  getUserProfile,
  logoutApi,
  updateUserInfo,
  type UserInfo,
  type UpdateUserPayload,
} from "../api/user";
import axios from "axios";
import router from "../router";
import { ElMessage } from "element-plus";
import { computed, ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const userInfo = ref<UserInfo | null>(null);
  const isInitialized = ref<Boolean>(false);
  const isLoggedIn = computed(() => !!userInfo.value);

  const fetchUserProfile = async () => {
    try {
      const data = await getUserProfile();
      userInfo.value = data as unknown as UserInfo;
      localStorage.setItem("is_logged_in", "true");
    } catch (error) {
      userInfo.value = null;
      // 回傳401為Token過期，把標記清掉
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("is_logged_in");
      }
    } finally {
      isInitialized.value = true;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      ElMessage({
        showClose: true,
        message: "登出成功，期待再次見到您！",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("登出過程發生錯誤", error);
    } finally {
      userInfo.value = null;
      isInitialized.value = false;
      // 登出一定要清掉is_logged_in標記，否則下次重整會觸發 API 導致紅字
      localStorage.removeItem("is_logged_in");
      router.push({ name: "Home" });
    }
  };

  const updateProfile = async (payload: UpdateUserPayload) => {
    try {
      const data = await updateUserInfo(payload);
      if (userInfo.value) {
        userInfo.value = { ...userInfo.value, ...data };
        const newData = await getUserProfile();
        userInfo.value = newData as unknown as UserInfo;
      }

      ElMessage({
        showClose: true,
        message: "資料更新成功！",
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msgMap: Record<string, string> = {
          EMAIL_ALREADY_TAKEN: "Email 已被使用",
          USER_NOT_FOUND: "找不到使用者",
        };
        const serverMsg = err.response?.data?.message;
        ElMessage({
          showClose: true,
          message: msgMap[serverMsg] ?? "更新失敗，請稍後再試",
          type: "error",
          duration: 3000,
        });
      }
      throw err;
    }
  };

  return {
    userInfo,
    isInitialized,
    isLoggedIn,
    fetchUserProfile,
    logout,
    updateProfile,
  };
});
