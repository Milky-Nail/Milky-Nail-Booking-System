import apiClient from "./client";
export interface Schedule {
  staff_id: Number;
  start_time: String;
  end_time: String;
  work_date: String;
  status: "active" | "cancelled";
}
export interface TimeSlot {
  date: string;
  time: string;
  isAvailable: boolean;
}
export interface ApiResponse {
  success: boolean;
  message: string;
  count?: number;
  errors?: Array<{ row: number; message: string }>;
}
const getSchedule = (): Promise<Schedule[]> => apiClient.get("/schedules");
const getSchedulesByStaff = (staffId: number): Promise<Schedule[]> =>
  apiClient.get(`/schedules/${staffId}`);

const uploadSchedule = (file: File) => {
  const formData = new FormData();
  formData.append("file", file); // 對應後端 upload.single("file")

  return apiClient.post<ApiResponse, ApiResponse, FormData>(
    "/schedules/upload",
    formData,
    {}
  );
};
const cancelSchedule = (staffId: number, workDate: string) =>
  apiClient.post(`/schedules/${staffId}/${workDate}/cancel`);

export { getSchedule, getSchedulesByStaff, uploadSchedule, cancelSchedule };
