import { AppointmentHandler } from "../controllers/appointment.controller";
import { Router } from "express";

const router = Router();

router.get("/", AppointmentHandler.getAppointmentList);
router.post("/", AppointmentHandler.createNewAppointment);

export default router;
