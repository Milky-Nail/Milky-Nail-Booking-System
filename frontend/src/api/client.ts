import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 5000,
  // 設定讓透過service發送的請求都會帶cookie
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("使用者尚未登入 (401)");
      return Promise.reject({ silent: true, ...error });
    }
    console.error("API 呼叫失敗:", error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
