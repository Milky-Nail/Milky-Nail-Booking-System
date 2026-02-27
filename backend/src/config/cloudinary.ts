import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

//因process.env的屬性預設類型可能是undefined，所以在使用前需要檢查是否存在必要的環境變數，以避免在運行時出現錯誤。
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Missing Cloudinary configuration in environment variables");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
