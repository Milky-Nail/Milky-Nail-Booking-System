import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 5000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API 呼叫失敗:", error.message);
    return Promise.reject(error);
  }
);
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default apiClient;
