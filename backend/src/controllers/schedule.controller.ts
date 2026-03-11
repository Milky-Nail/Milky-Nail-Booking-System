import { Request, Response } from "express";
import { SchedulesService } from "src/services/schedule.service";

const SchedulesHandler = {
  async getScheduleList(req: Request, res: Response) {
    try {
      const data = await SchedulesService.getSchedules();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "server error", err });
    }
  },
};

export { SchedulesHandler };
