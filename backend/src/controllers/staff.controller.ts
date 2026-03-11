import { StaffService } from "../services/staff.service";
import { Request, Response } from "express";

const StaffHandler = {
  async getStaffList(req: Request, res: Response) {
    try {
      const data = await StaffService.getStaffs();
      res.json(data);
    } catch (err) {
      res.status(500).send({ message: "server error", err });
    }
  },
};

export { StaffHandler };
