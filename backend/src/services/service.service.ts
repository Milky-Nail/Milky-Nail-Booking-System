import { prisma } from "../lib/prisma.js";

const ServiceService = {
  async getServices() {
    return await prisma.service_categories.findMany({
      orderBy: {
        sort_order: "asc",
      },
      include: {
        services: {
          orderBy: {
            sort_order: "asc",
          },
          include: {
            service_prices: {
              orderBy: {
                price: "asc",
              },
            },
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
