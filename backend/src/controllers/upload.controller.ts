import { Request, Response } from "express";
import { uploadToCloudinary } from "../services/upload.service";
import fs from "fs";

export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) res.status(400).json({ message: "未上傳檔案" });
    const result = await uploadToCloudinary(req.file!.path);

    // 成功上傳後，刪除本地暫存檔案（節省伺服器空間）
    fs.unlinkSync(req.file!.path);

    return res.status(200).json({
      url: result.optimized_url,
      public_id: result.public_id,
      original_url: result.secure_url,
    });
  } catch (err) {
    console.error("上傳失敗：", err);
    return res.status(500).json({ message: "圖片上傳失敗" });
  }
};
