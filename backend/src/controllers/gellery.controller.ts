import { Request, Response } from "express";
import { galleryService } from "src/services/gallery.service";

const galleryHandler = (req: Request, res: Response) => {
  const data = req.body;
  console.log(data);
  if (!data.title || !data.price || !data.description || !data.image_url) {
    return res.status(400).json({ message: "資料不完整" });
  }
  try {
    const newWork = galleryService.uploadWork(data);
    return res.status(201).json({ message: "上傳成功", data: newWork });
  } catch (err: unknown) {
    console.log("上傳失敗：", err);
    if (err instanceof Error) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "發生預期外的錯誤",
    });
  }
};

export { galleryHandler };
