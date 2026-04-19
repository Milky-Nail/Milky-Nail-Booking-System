import { v2 as cloudinary } from "cloudinary";
import { uploadImage } from "./cloudinary.service";

export const uploadToCloudinary = async (filePath: string) => {
  try {
    const publicId = `quote/${Date.now()}`;
    const result = await uploadImage(filePath, publicId);

    const optimizedUrl = cloudinary.url(result.public_id, {
      fetch_format: "auto",
      quality: "auto",
      secure: true,
    });

    return {
      ...result,
      optimized_url: optimizedUrl,
    };
  } catch (err) {
    console.error("上傳失敗：", err);
    throw err;
  }
};
