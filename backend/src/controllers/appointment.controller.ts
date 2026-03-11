import { Request, Response } from "express";
import { AppointmentService } from "src/services/appointement.service";

const AppointmentHandler = {
  async getAppointmentList(req: Request, res: Response) {
    const { staff_id, date } = req.query;
    try {
      //req.query的結果可能是staff_id|staff_id[]|undefined
      const idParam = Array.isArray(staff_id) ? staff_id[0] : staff_id;
      const parsedStaffId = idParam ? Number(idParam) : undefined;
      if (idParam && isNaN(parsedStaffId as number)) {
        return res.status(400).json({ message: "無效的美甲師 ID" });
      }
      const data = await AppointmentService.getAppointment({
        staff_id: parsedStaffId as number,
        date: date as string,
      });
      console.log(data); //TODO:記得刪掉
      return res.json(data);
    } catch (err) {
      res.status(500).json({ message: "server error", err });
    }
  },
  async createNewAppointment(req: Request, res: Response) {
    try {
      const data = req.body;

      if (!data.items || data.items.length === 0) {
        return res.status(400).json({ message: "預約必須至少包含一個項目" });
      }
      const newAppointment = await AppointmentService.createAppointments(data);
      return res.status(201).json({
        message: "預約成功",
        data: newAppointment,
      });
    } catch (err: unknown) {
      console.log("預約失敗：", err);
      if (err instanceof Error) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "發生預期外的錯誤",
      });
    }
  },
};

export { AppointmentHandler };
