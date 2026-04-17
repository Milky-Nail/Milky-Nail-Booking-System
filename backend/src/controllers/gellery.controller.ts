import { Request, Response } from "express";
import { galleryService } from "src/services/gallery.service";

const GalleryHandler = {
  async uploadWork(req: Request, res: Response) {
    const data = req.body;

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
  },
  async getWorks(req: Request, res: Response) {
    const tag = req.query.tag as string | undefined;
    const price = Number(req.query.price);
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const filter = { tag, price, pagination: { page, limit } };
    try {
      const work = await galleryService.getWorks(filter);
      return res.status(200).json(work);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json(err.message);
      }
    }
  },
  async showWorkOrNot(req: Request, res: Response) {
    const id = req.params.id as string;
    const status = req.body.status;
    try {
      const updated = await galleryService.showWorkOrNot(id, status);
      return res.status(200).json(updated);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json(err.message);
      }
    }
  },
};

export { GalleryHandler };
