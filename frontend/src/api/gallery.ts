import apiClient from "./client";

export interface Gallery {
  image_url: string;
  title: string;
  price: number;
  description: string;
  tags: string[];
}

export const uploadWork = async (data: Gallery) => {
  try {
    const res = await apiClient.post("/gallery", data);
    return res;
  } catch (err) {
    console.error("無法上傳資料:", err);
    throw err;
  }
};
