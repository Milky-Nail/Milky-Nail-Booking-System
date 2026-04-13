import { Router } from "express";
import serviceRoute from "./service";
import staffRoute from "./staff";
import scheduleRoute from "./schedule";
import appointmentRoute from "./appointment";
import authRouter from "./auth";
import userRouter from "./user";
import uploadImageRouter from "./upload";
import galleyRouter from "./gallery";
import quoteRouter from "./quote";

const rootRouter = Router();

rootRouter.use("/services", serviceRoute);
rootRouter.use("/staffs", staffRoute);
rootRouter.use("/schedules", scheduleRoute);
rootRouter.use("/appointments", appointmentRoute);
rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/upload", uploadImageRouter);
rootRouter.use("/gallery", galleyRouter);
rootRouter.use("/quote", quoteRouter);

export default rootRouter;
