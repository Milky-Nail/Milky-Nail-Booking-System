import { Router } from "express";
import { UserHandler } from "src/controllers/user.controller";
import { authenticate, isAdmin } from "src/middlewares/auth.middleware";

const router = Router();

router.get("/me", authenticate, UserHandler.getMyProfile);
router.get("/", isAdmin, UserHandler.getList);
router.patch("/", authenticate, UserHandler.updateUserController);
router.patch("/role/:userId", isAdmin, UserHandler.changeUserRoleController);
router.patch(
  "/block-status/:userId",
  isAdmin,
  UserHandler.changeUserBlockStatusController
);

export default router;
