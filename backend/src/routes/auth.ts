import {
  lineCallback,
  googleLogin,
  googleCallback,
  logout,
  lineInit,
} from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/line/init", lineInit);
router.get("/line/callback", lineCallback);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.post("/logout", logout);

export default router;
