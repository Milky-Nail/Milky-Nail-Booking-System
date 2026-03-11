import { prisma } from "../lib/prisma.js";

const ServiceService = {
  async getServices() {
    return await prisma.service_categories.findMany({
      include: {
        services: {
          include: {
            service_prices: true,
            service_addon_options_service_addon_options_requires_service_idToservices:
              {
                include: {
                  service_addons: true,
                },
              },
          },
        },
      },
    });
  },
};

export { ServiceService };
