import { Request, Response } from "express";
import { AppointmentService } from "src/services/appointment.service";

const AppointmentHandler = {
  async getAppointmentByTime(req: Request, res: Response) {
    try {
      const startFrom = req.query.startFrom as string;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const queryDate = new Date(Number(startFrom));
      if (isNaN(queryDate.getTime())) {
        return res.status(400).json({ message: "無效的時間格式" });
      }
      const result = await AppointmentService.getAppointmentsByTime(queryDate, {
        page: Number(page),
        limit: Number(limit),
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "server error", err });
    }
  },

  async getAppointmentListByStaff(req: Request, res: Response) {
    const { staff_id, date } = req.query;
    try {
      //req.query的結果可能是staff_id|staff_id[]|undefined
      const idParam = Array.isArray(staff_id) ? staff_id[0] : staff_id;
      const parsedStaffId = idParam ? Number(idParam) : undefined;
      if (idParam && isNaN(parsedStaffId as number)) {
        return res.status(400).json({ message: "無效的美甲師 ID" });
      }
      const data = await AppointmentService.getAppointmentByStaff({
        staff_id: parsedStaffId as number,
        date: date as string,
      });
      console.log(data); //TODO:記得刪掉
      return res.json(data);
    } catch (err) {
      res.status(500).json({ message: "server error", err });
    }
  },

  async getAppointmentListByUser(req: Request, res: Response) {
    const { user_id } = req.query;
    try {
      //req.query的結果可能是staff_id|staff_id[]|undefined
      const idParam = Array.isArray(user_id) ? user_id[0] : user_id;
      const parsedUserId = idParam ? Number(idParam) : undefined;
      if (idParam && isNaN(parsedUserId as number)) {
        return res.status(400).json({ message: "無效的使用者 ID" });
      }
      const data = await AppointmentService.getAppointmentByUser({
        user_id: parsedUserId as number,
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

      if (!data.appointment_items || data.appointment_items.length === 0) {
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

  async cancelAppointment(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const userId = Number(req.userId);
      if (!userId) {
        return res.status(401).json({ message: "未授權" });
      }
      if (!id) {
        return res.status(400).json({ message: "缺少預約 ID" });
      }
      if (isNaN(id)) {
        return res.status(400).json({ message: "預約ID應為數字格式" });
      }
      const result = await AppointmentService.handleUserCancellation(
        id,
        userId
      );
      return res.status(200).json({
        message: "預約取消成功",
        data: result,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "更新失敗";
      const status = errorMessage.includes("權限")
        ? 403
        : errorMessage.includes("不存在")
        ? 404
        : 400;
      return res.status(status).json({
        error: errorMessage,
      });
    }
  },

  async changeStatusByAdmin(req: Request, res: Response) {
    try {
      const { role } = req;
      const { id, status: newStatus } = req.body;

      if (role !== "admin") {
        return res.status(401).json({ message: "未授權之操作" });
      }
      if (!id) {
        return res.status(400).json({ message: "缺少預約 ID" });
      }
      const numericId = Number(id);
      if (isNaN(numericId)) {
        return res.status(400).json({ message: "預約ID應為數字格式" });
      }
      if (!newStatus) {
        return res.status(400).json({ message: "預約狀態不得為空" });
      }
      const result = await AppointmentService.changeStatus(
        numericId,
        newStatus
      );
      return res.status(200).json({
        message: "預約狀態修改成功",
        data: result,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "更新失敗";
      const status = errorMessage.includes("權限")
        ? 403
        : errorMessage.includes("不存在")
        ? 404
        : 400;
      return res.status(status).json({
        error: errorMessage,
      });
    }
  },
};

export { AppointmentHandler };
