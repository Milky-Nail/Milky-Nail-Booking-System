import { prisma } from "../lib/prisma.js";

const StaffService = {
  async getStaffs() {
    return await prisma.staff.findMany({
      include: {
        staff_portfolios: {
          select: {
            caption: true,
            image_url: true,
            staff_id: true,
            service_id: true,
          },
        },
        staff_services: true,
      },
    });
  },
};

export { StaffService };
