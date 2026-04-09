import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (filePath: string, publicId: string) => {
  return await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    folder: "milky-nails",
  });
};

export const getOptimizedUrl = (publicId: string) => {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    width: 500,
    height: 500,
    crop: "auto",
    gravity: "auto",
  });
};
