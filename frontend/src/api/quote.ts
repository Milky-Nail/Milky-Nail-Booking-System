import apiClient from "./client";

interface Appointment {
  user_id: number;
  staff_id: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  start_time: string;
  end_time: string;
  total_price: number;
}
interface User {
  name: string;
  line_id: true;
}
export interface QuoteRequest {
  appointments: Appointment;
  appointment_id: number;
  users: User;
  id: number;
  created_at: Date;
  user_id: number;
  staff_id: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  staff_reply: string;
  replied_at: Date;
  description: string;
  image_url: string;
  quoted_price: number;
}

export interface QuoteRequestPagination {
  data: QuoteRequest[];
  totalCount: number;
}

const getQuoteRequest = async (
  page = 1,
  limit = 3
): Promise<QuoteRequestPagination> => {
  try {
    const res = await apiClient.get("/quote", { params: { page, limit } });
    return res as unknown as QuoteRequestPagination;
  } catch (err) {
    console.error("無法上傳資料:", err);
    throw err;
  }
};
const updateQuoteRequest = async (
  id: number,
  staffReply: string,
  price: number
) => {
  try {
    const res = await apiClient.post("/quote/update", {
      id,
      staffReply,
      price,
    });
    return res;
  } catch (err) {
    console.error("無法上傳資料:", err);
    throw err;
  }
};

export { getQuoteRequest, updateQuoteRequest };
