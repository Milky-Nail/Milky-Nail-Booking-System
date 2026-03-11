import apiClient from "./client";
export interface AppointmentItem {
  service_id: number;
  service_price_id: number;
  price_snapshot: number;
  duration_snapshot: number;
}
export interface AppointmentAddon {
  addon_id: number;
  price_snapshot: number;
  duration_snapshot: number;
}
export interface AppointmentData {
  user_id: number;
  staff_id: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  start_time: string;
  end_time: string;
  total_price: number;
  note: string;
  items: AppointmentItem[];
  addons: AppointmentAddon[];
}
export interface BookedSlot {
  start_time: string;
  end_time: string;
}

const createAppointment = (data: AppointmentData): Promise<AppointmentData> =>
  apiClient.post("/appointments", data);
const getAppointment = (): Promise<AppointmentData[]> =>
  apiClient.get("/appointments");

const getAppointmentsByStaff = async (
  staffId: string | number,
  date: string
): Promise<BookedSlot[]> => {
  try {
    const res = (await apiClient.get("/appointments", {
      params: {
        staff_id: staffId,
        date: date,
      },
    })) as unknown as BookedSlot[];
    return res;
  } catch (err) {
    console.error("無法取得預約資料:", err);
    return [];
  }
};
export { createAppointment, getAppointment, getAppointmentsByStaff };
