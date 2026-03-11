import { prisma } from "../lib/prisma.js";

const SchedulesService = {
  async getSchedules() {
    return await prisma.schedules.findMany({
      select: {
        staff_id: true,
        work_date: true,
        start_time: true,
        end_time: true,
      },
    });
  },
};

export { SchedulesService };
