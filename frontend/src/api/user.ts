import apiClient from "./client";

export interface UserInfo {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  line_id: string | null;
  google_id: string | null;
  phone: string | null;
  role: "user" | "admin" | "technician";
  is_blocked: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
}

export interface UserResponse {
  data: UserInfo[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getUserProfile = () => {
  return apiClient.get("/user/me");
};

export const getAllUsersProfile = async (
  page = 1,
  limit = 10
): Promise<UserResponse | null> => {
  try {
    const res = (await apiClient.get<UserResponse>("/user/", {
      params: { page, limit },
    })) as unknown as UserResponse;

    return res;
  } catch (err) {
    console.error("無法取得預約資料:", err);
    return null;
  }
};

export const updateUserInfo = async (payload: UpdateUserPayload) => {
  return apiClient.patch("/user/", payload);
};

export const logoutApi = () => {
  return apiClient.post("/auth/logout");
};

export const changeUserRole = (userId: string, newRole: string) => {
  return apiClient.patch(`/user/role/${userId}`, { role: newRole });
};

export const changeUserBlockStatus = (userId: string, newStatus: boolean) => {
  return apiClient.patch(`/user/block-status/${userId}`, {
    is_blocked: newStatus,
  });
};
