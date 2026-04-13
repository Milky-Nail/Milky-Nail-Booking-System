import Router from "express";
import { QuoteRequestHandler } from "../controllers/quote.controller";
import { isAdmin, authMiddleWare } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleWare, isAdmin, QuoteRequestHandler.getQuoteRquest);
router.post(
  "/update",
  authMiddleWare,
  isAdmin,
  QuoteRequestHandler.updateQuoteRequest
);

export default router;
