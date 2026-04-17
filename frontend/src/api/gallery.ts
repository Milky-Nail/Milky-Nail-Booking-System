import apiClient from "./client";

export interface Gallery {
  image_url: string;
  title: string;
  price: number;
  description: string;
  tags: string[];
}

export interface WorkFilter {
  tag?: string | undefined;
  price?: number;
  pagination?: {
    page?: number;
    limit?: number;
  };
}

export interface WorkData {
  id: string;
  title: string;
  image_url: string;
  price: number;
  tags: string[];
  description: string;
  created_at: Date;
  is_showed: boolean;
}

export interface WorkResponse {
  data: WorkData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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

export const getWorks = async (data: WorkFilter): Promise<WorkResponse> => {
  try {
    const res = (await apiClient.get<WorkResponse>("/gallery", {
      params: {
        tag: data.tag,
        price: data.price,
        pagination: data.pagination,
      },
    })) as unknown as WorkResponse;
    return res;
  } catch (err) {
    console.error("無法上傳資料:", err);
    throw err;
  }
};

export const showWorkOrNot = async (id: string, status: boolean) => {
  try {
    const res = await apiClient.patch(`/gallery/${id}`, {
      status: status,
    });
    return res;
  } catch (err) {
    console.error("無法上傳資料:", err);
    throw err;
  }
};
