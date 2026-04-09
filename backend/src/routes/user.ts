import { Router } from "express";
import {
  getMyProfile,
  updateUserController,
  getList,
  changeUserRoleController,
  changeUserBlockStatusController,
} from "src/controllers/user.controller";
import {
  authenticate,
  authMiddleWare,
  isAdmin,
} from "src/middlewares/auth.middleware";

const router = Router();

router.get("/me", authenticate, getMyProfile);
router.get("/", isAdmin, getList);
router.patch("/", authMiddleWare, updateUserController);
router.patch("/role/:userId", isAdmin, changeUserRoleController);
router.patch("/block-status/:userId", isAdmin, changeUserBlockStatusController);

export default router;
