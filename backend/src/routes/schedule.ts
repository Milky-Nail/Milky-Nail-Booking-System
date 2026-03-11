import { SchedulesHandler } from "../controllers/schedule.controller";
import { Router } from "express";

const router = Router();

router.get("/", SchedulesHandler.getScheduleList);

export default router;
