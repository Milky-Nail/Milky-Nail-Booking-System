import { Router } from "express";
import { galleryHandler } from "../controllers/gellery.controller";
import { isAdmin } from "src/middlewares/auth.middleware";

const router = Router();

router.post("/", isAdmin, galleryHandler);

export default router;
