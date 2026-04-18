import rateLimit from "express-rate-limit";

export const uploadRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  keyGenerator: (req) => String(req.user?.id),
  handler: (req, res) => {
    res.status(429).json({ message: "上傳太頻繁，請稍後再試" });
  },
});
