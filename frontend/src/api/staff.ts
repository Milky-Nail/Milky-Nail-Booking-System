import apiClient from "./client";

export interface StaffService {
  staff_id: number;
  service_id: number;
}
export interface StaffPortfolio {
  caption: string;
  image_url: string;
  staff_id: number;
  service_id: number;
}
export interface Staff {
  id: number;
  name: string;
  avatar_url: string;
  bio: string;
  staff_services: StaffService[];
  staff_portfolios: StaffPortfolio[];
}

const getStaff = (): Promise<Staff[]> => apiClient.get("/staffs");

export { getStaff };
