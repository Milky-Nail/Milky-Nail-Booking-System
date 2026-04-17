import { Router } from "express";
import { GalleryHandler } from "../controllers/gellery.controller";
import { isAdmin } from "src/middlewares/auth.middleware";

const router = Router();

router.post("/", isAdmin, GalleryHandler.uploadWork);
router.get("/", GalleryHandler.getWorks);
router.patch("/:id", isAdmin, GalleryHandler.showWorkOrNot);

export default router;
