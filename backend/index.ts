BigInt.prototype.toJSON = function () {
  return this.toString();
};

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rootRouter from "./src/routes/index";
import passport from "./src/config/passport";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", `${process.env.FRONTEND_URL}`],
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use("/api", rootRouter);
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
