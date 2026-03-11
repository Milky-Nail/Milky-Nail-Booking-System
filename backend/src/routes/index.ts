import { Router } from "express";
import serviceRoute from "./service";
import staffRoute from "./staff";
import scheduleRoute from "./schedule";
import appointmentRoute from "./appointment";

const rootRouter = Router();

rootRouter.use("/services", serviceRoute);
rootRouter.use("/staffs", staffRoute);
rootRouter.use("/schedules", scheduleRoute);
rootRouter.use("/appointments", appointmentRoute);

export default rootRouter;
