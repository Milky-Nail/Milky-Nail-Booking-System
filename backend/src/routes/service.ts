import { Router } from "express";
import { ServiceHandler } from "src/controllers/service.controller";

const router = Router();

router.get("/", ServiceHandler.getServiceList);

export default router;
