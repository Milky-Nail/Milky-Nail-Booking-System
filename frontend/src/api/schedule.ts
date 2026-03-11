import apiClient from "./client";
export interface Schedule {
  staff_id: Number;
  start_time: String;
  end_time: String;
  work_date: String;
}
export interface TimeSlot {
  date: string;
  time: string;
  isAvailable: boolean;
}
const getSchedule = (): Promise<Schedule[]> => apiClient.get("/schedules");

export { getSchedule };
