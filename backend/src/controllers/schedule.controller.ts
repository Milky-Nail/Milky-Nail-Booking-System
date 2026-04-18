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
  async getScheduleListByStaff(req: Request, res: Response) {
    try {
      const staffId = parseInt(req.params.staffId as string);
      const data = await SchedulesService.getSchedulesByStaff(staffId);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: "server error", err });
    }
  },
  async uploadSchedule(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "請選擇要上傳的 Excel 檔案" });
      }
      const result = await SchedulesService.batchSaveSchedules(req.file.buffer);
      if (!result.success) {
        return res.status(400).json({
          message: "Excel 檔案處理失敗",
          errors: result.errors,
        });
      }
      return res.status(200).json({
        message: `成功匯入 ${result.count} 筆班表資料`,
      });
    } catch (err) {
      return res.status(500).json({ message: "伺服器錯誤" });
    }
  },
  async cancelSchedule(req: Request, res: Response) {
    try {
      const staffId = parseInt(req.params.staffId as string);
      const workDate = req.params.workDate as string;
      await SchedulesService.cancelSchedule(staffId, workDate);
      return res.status(200).json({ message: "班表已刪除" });
    } catch (err) {
      return res
        .status(400)
        .json({ message: err instanceof Error ? err.message : "無法取消班表" });
    }
  },
};

export { SchedulesHandler };
