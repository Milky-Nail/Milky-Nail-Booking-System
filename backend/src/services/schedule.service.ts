import dayjs from "dayjs";
import { prisma } from "../lib/prisma.js";
import { parseScheduleExcel, type Schedule } from "src/utils/parseSchedule.js";

const SchedulesService = {
  async getSchedules() {
    return await prisma.schedules.findMany({
      where: { status: "active" },
      select: {
        staff_id: true,
        work_date: true,
        start_time: true,
        end_time: true,
      },
    });
  },
  async getSchedulesByStaff(staffId: number) {
    return await prisma.schedules.findMany({
      orderBy: { work_date: "asc" },
      where: {
        staff_id: staffId,
        work_date: {
          gte: dayjs().subtract(1, "month").toDate(),
          lte: dayjs().add(1, "month").toDate(),
        },
      },
      select: {
        staff_id: true,
        work_date: true,
        start_time: true,
        end_time: true,
        status: true,
      },
    });
  },
  async batchSaveSchedules(fileBuffer: Buffer) {
    const { records, errors } = parseScheduleExcel(fileBuffer);
    //有錯誤提早回傳，避免髒資料寫入資料庫
    if (errors.length > 0) {
      return { success: false, records: [], errors };
    }
    try {
      //$transaction批次寫入，如果有任何一筆資料錯誤就會回滾整個寫入，確保資料一致性
      const result = await prisma.$transaction(
        records.map((record: Schedule) =>
          prisma.schedules.upsert({
            where: {
              staff_id_work_date: {
                staff_id: record.staff_id,
                work_date: new Date(record.work_date),
              },
            },
            update: {
              start_time: new Date(record.start_time),
              end_time: new Date(record.end_time),
              status: record.status,
            },
            create: {
              staff_id: record.staff_id,
              work_date: new Date(record.work_date),
              start_time: new Date(record.start_time),
              end_time: new Date(record.end_time),
              status: record.status,
            },
          })
        )
      );
      return { success: true, count: result.length, errors: [] };
    } catch (err) {
      const message = err instanceof Error ? err.message : "資料庫寫入失敗";
      return {
        success: false,
        records: [],
        errors: [{ row: 0, message: `系統錯誤: ${message}` }],
      };
    }
  },

  async cancelSchedule(staffId: number, workDate: string) {
    const startOfDay = dayjs
      .tz(workDate, "Asia/Taipei")
      .startOf("day")
      .toDate();
    const endOfDay = dayjs.tz(workDate, "Asia/Taipei").endOf("day").toDate();
    const conflictAppointment = await prisma.appointments.findFirst({
      where: {
        staff_id: staffId,
        start_time: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { in: ["pending", "confirmed"] },
      },
    });
    if (conflictAppointment) {
      throw new Error("該日期已有預約訂單，無法取消班表");
    }
    return await prisma.schedules.update({
      where: {
        staff_id_work_date: {
          staff_id: staffId,
          work_date: new Date(workDate),
        },
      },
      data: {
        status: "cancelled",
      },
    });
  },
};

export { SchedulesService };
