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
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());
app.use(
  cors({
    origin: [`${process.env.FRONTEND_URL}`],
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use("/api", rootRouter);
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "data:", "https:"],
      "script-src": ["'self'", "'unsafe-inline'"],
    },
  })
);
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
