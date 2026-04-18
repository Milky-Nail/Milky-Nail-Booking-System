import Router from "express";
import { QuoteRequestHandler } from "../controllers/quote.controller";
import { isAdmin, authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, isAdmin, QuoteRequestHandler.getQuoteRquest);
router.post(
  "/update",
  authenticate,
  isAdmin,
  QuoteRequestHandler.updateQuoteRequest
);

export default router;
