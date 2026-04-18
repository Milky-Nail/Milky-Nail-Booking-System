import { authenticate, isAdmin } from "src/middlewares/auth.middleware";
import { AppointmentHandler } from "../controllers/appointment.controller";
import { Router } from "express";

const router = Router();

router.get("/search", isAdmin, AppointmentHandler.getAppointmentByTime);
router.patch(
  "/admin/change-status",
  isAdmin,
  AppointmentHandler.changeStatusByAdmin
);
router.get("/user", authenticate, AppointmentHandler.getAppointmentListByUser);
router.get("/staff", AppointmentHandler.getAppointmentListByStaff);
router.post("/", authenticate, AppointmentHandler.createNewAppointment);
router.patch("/:id/cancel", authenticate, AppointmentHandler.cancelAppointment);

export default router;
