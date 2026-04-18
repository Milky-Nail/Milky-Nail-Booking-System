import { Router } from "express";
import multer from "multer";
import { handleFileUpload } from "src/controllers/upload.controller";
import { authenticate } from "src/middlewares/auth.middleware";
import { uploadRateLimit } from "src/middlewares/uploadRateLimit";

const router = Router();

const uploadImage = multer({ dest: "uploads/" });

router.post(
  "/",
  authenticate,
  uploadRateLimit,
  uploadImage.single("file"),
  handleFileUpload
);

export default router;
