export interface UploadResponse {
  url: string;
  public_id: string;
}

export const UPLOAD_URL = `${import.meta.env.VITE_API_BASE_URL}/upload`;
