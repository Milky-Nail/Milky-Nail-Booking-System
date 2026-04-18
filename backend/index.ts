BigInt.prototype.toJSON = function () {
  return this.toString();
};

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rootRouter from "./src/routes/index";
import passport from "./src/config/passport";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://milky-nail-test.onrender.com"], // TODO:正式上線前要改成前端網址
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use("/api", rootRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
