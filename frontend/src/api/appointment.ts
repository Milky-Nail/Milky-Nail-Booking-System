import apiClient from "./client";
export interface AppointmentItem {
  id: number;
  service_id: number;
  service_price_id: number;
  price_snapshot: number;
  duration_snapshot: number;
  services?: { name: string };
  service_price?: { label: string };
  appointment_addons: AppointmentAddon[];
}
export interface AppointmentAddon {
  id: number;
  addon_id: number;
  price_snapshot: number;
  duration_snapshot: number;
  quantity: number;
  service_addons?: {
    name: string;
  };
}

export interface AppointmentAddonInput {
  addon_id: number;
  price_snapshot: number;
  duration_snapshot: number;
  quantity: number;
}

export interface AppointmentItemInput {
  service_id: number;
  service_price_id: number;
  price_snapshot: number;
  duration_snapshot: number;
  appointment_addons: AppointmentAddonInput[];
}
export interface QuoteRequest {
  image_url: string;
  description: string;
  staff_id: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
}
export interface AppointmentData {
  user_id: number | null;
  staff_id: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  start_time: string;
  end_time: string;
  total_price: number;
  note: string;
  appointment_items: AppointmentItemInput[];
  email: string;
  line_id: string;
  quote_request?: QuoteRequest;
}

export interface BookedSlot {
  start_time: string;
  end_time: string;
}
export interface UserAppointmentList {
  id: number;
  staff_id: number;
  start_time: string;
  end_time: string;
  total_price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  appointment_items: AppointmentItem[];
  appointment_addons: AppointmentAddon[];
  staff: { name: string };
}
export interface AppointmentList {
  id: number;
  staff_id: number;
  start_time: string;
  end_time: string;
  total_price: number;
  note: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  appointment_items: AppointmentItem[];
  staff: { name: string };
  users: { name: string };
}

export interface AppointmentResponse {
  data: AppointmentList[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
const createAppointment = (data: AppointmentData): Promise<AppointmentData> =>
  apiClient.post("/appointments", data);

const getAppointmentByTime = async (
  targetDate: Date,
  isTilNow: boolean,
  page = 1,
  limit = 10
): Promise<AppointmentResponse | null> => {
  const timestamp = targetDate.getTime();
  try {
    const res = (await apiClient.get<AppointmentResponse>(
      `/appointments/search`,
      {
        params: { startFrom: timestamp, isTilNow, page, limit },
      }
    )) as unknown as AppointmentResponse;
    return res;
  } catch (err) {
    console.error("無法取得預約資料:", err);
    return null;
  }
};

const getAppointmentsByStaff = async (
  staffId: string | number,
  date: string
) => {
  try {
    const res = (await apiClient.get("/appointments/staff", {
      params: {
        staff_id: staffId,
        date: date,
      },
    })) as unknown as BookedSlot[]; //因為apiClient攔截器已經把外層（status、headers等拿掉），在Axios的原生宣告下apiClient.get<T> 會回傳 Promise<AxiosResponse<T>>，而TS會把res當成是一個包含data, status, headers 的 物件，而不是陣列，所以這裡要斷言宣告我要傳的是BookedSlot[]
    return res;
  } catch (err) {
    console.error("無法取得預約資料:", err);
    return [];
  }
};

const getAppointmentByUser = async (
  userId: string | number
): Promise<UserAppointmentList[]> => {
  try {
    const res = (await apiClient.get<UserAppointmentList[]>(
      "/appointments/user",
      {
        params: {
          user_id: userId,
        },
      }
    )) as unknown as UserAppointmentList[];
    return res;
  } catch (err) {
    console.error("無法取得預約資料:", err);
    return [];
  }
};

/**
 * 使用者取消自己的預約
 * @param id 預約的唯一識別碼 (Appointment ID)
 */

const userCancelAppointment = async (id: number) => {
  try {
    const res = await apiClient.patch(`/appointments/${id}/cancel`);
    return res;
  } catch (err) {
    console.error("無法取消預約:", err);
    throw err;
  }
};

/**
 * 管理者更新預約狀態
 * @param id 預約單 ID
 * @param newStatus 新狀態 (pending, confirmed, etc.)
 */
const adminChangeStatus = async (id: number, newStatus: string) => {
  try {
    const res = await apiClient.patch(`/appointments/admin/change-status`, {
      id: id,
      status: newStatus,
    });
    return res;
  } catch (err) {
    console.error("無法更新狀態:", err);
    throw err;
  }
};

export {
  createAppointment,
  getAppointmentByTime,
  getAppointmentsByStaff,
  getAppointmentByUser,
  userCancelAppointment,
  adminChangeStatus,
};
