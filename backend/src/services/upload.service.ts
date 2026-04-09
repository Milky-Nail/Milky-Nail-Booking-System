import { uploadImage } from "./cloudinary.service";

export const uploadToCloudinary = async (filePath: string) => {
  try {
    const publicId = `quote/${Date.now()}`;
    const result = await uploadImage(filePath, publicId);

    return result;
  } catch (err) {
    console.error("上傳失敗：", err);
    throw err;
  }
};
