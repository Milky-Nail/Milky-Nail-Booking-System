import { Router } from "express";
import multer from "multer";
import { handleFileUpload } from "src/controllers/upload.controller";

const router = Router();

const uploadImage = multer({ dest: "uploads/" });

router.post("/", uploadImage.single("file"), handleFileUpload);

export default router;
