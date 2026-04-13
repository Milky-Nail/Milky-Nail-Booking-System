import { authMiddleWare, isAdmin } from "src/middlewares/auth.middleware";
import { AppointmentHandler } from "../controllers/appointment.controller";
import { Router } from "express";

const router = Router();

router.get("/search", isAdmin, AppointmentHandler.getAppointmentByTime);
router.patch(
  "/admin/change-status",
  isAdmin,
  AppointmentHandler.changeStatusByAdmin
);
router.get(
  "/user",
  authMiddleWare,
  AppointmentHandler.getAppointmentListByUser
);
router.get("/staff", AppointmentHandler.getAppointmentListByStaff);
router.post("/", AppointmentHandler.createNewAppointment);
router.patch(
  "/:id/cancel",
  authMiddleWare,
  AppointmentHandler.cancelAppointment
);

export default router;
