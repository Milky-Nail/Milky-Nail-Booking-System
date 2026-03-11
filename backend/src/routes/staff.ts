import { Router } from "express";
import { StaffHandler } from "src/controllers/staff.controller";

const router = Router();

router.get("/", StaffHandler.getStaffList);

export default router;
