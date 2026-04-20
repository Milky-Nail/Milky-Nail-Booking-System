import { prisma } from "../lib/prisma.js";
import { PrismaClient } from "../generated/prisma/index.js";
import { appointment_status, quote_status } from "../generated/prisma/index.js";
import { pushAppointmentNotification } from "./lineMessage.service.js";

export interface AppointmentItem {
  service_id: number;
  service_price_id: number;
  price_snapshot: number;
  duration_snapshot: number;
  addons: AppointmentAddon[];
}
export interface AppointmentAddon {
  addon_id: number;
  price_snapshot: number;
  duration_snapshot: number;
  quantity: number;
}

export interface AppointmentItemInput {
  service_id: number;
  service_price_id: number;
  price_snapshot: number;
  duration_snapshot: number;
  appointment_addons: AppointmentAddonInput[];
}
export interface AppointmentAddonInput {
  addon_id: number;
  price_snapshot: number;
  duration_snapshot: number;
  quantity: number;
}
export interface QuoteRequest {
  image_url: string;
  description: string;
  staff_id: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
}
export interface AppointmentData {
  id: number;
  user_id: number | null;
  staff_id: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  start_time: string;
  end_time: string;
  total_price: number;
  note: string;
  email: string;
  line_id: string;
  appointment_items: AppointmentItemInput[];
  quote_request?: QuoteRequest;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

const AppointmentService = {
  async getAppointmentsByTime(
    time: Date,
    isTilNow: boolean,
    pagination: PaginationQuery = {}
  ) {
    if (!time) {
      throw new Error("未選定時間區間");
    }
    let whereCondition;

    if (isTilNow) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      whereCondition = {
        gte: startOfDay,
        lte: endOfDay,
      };
    } else {
      whereCondition = {
        gte: time,
      };
    }

    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        //all可以同時發送兩個獨立的資料庫請求（取資料與算總數），而不是一個接著一個做
        prisma.appointments.findMany({
          orderBy: { start_time: "desc" },
          skip: skip,
          take: limit,
          where: {
            start_time: whereCondition,
          },
          include: {
            staff: {
              select: {
                name: true,
              },
            },
            users: {
              select: {
                name: true,
              },
            },
            appointment_items: {
              include: {
                service_price: { select: { label: true } },
                appointment_addons: {
                  include: {
                    service_addons: { select: { name: true } },
                  },
                },
              },
            },
          },
        }),
        prisma.appointments.count({
          //計算總筆數
          where: { start_time: whereCondition },
        }),
      ]);
      return {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (err) {
      if (err instanceof Error) {
        const message = err instanceof Error ? err.message : "未知錯誤";
        throw new Error(`獲取失敗：${message}`);
      }
    }
  },

  async getAppointmentByStaff(filters: { staff_id: number; date: string }) {
    const { staff_id, date } = filters;
    let where = {
      status: { not: "cancelled" as appointment_status }, //枚舉屬性需要引入appointment_status宣告屬性為Enum
    };
    if (staff_id) {
      where = Object.assign(where, { staff_id: BigInt(staff_id) });
    }
    if (date) {
      const startOfDay = new Date(`${date}T00:00:00.000Z`);
      const endOfDay = new Date(`${date}T23:59:59.000Z`);
      where = Object.assign(where, {
        start_time: {
          gte: startOfDay,
          lte: endOfDay,
        },
      });
    }
    return await prisma.appointments.findMany({
      where,
      select: {
        id: true,
        start_time: true,
        end_time: true,
        staff_id: true,
        status: true,
      },
      orderBy: { start_time: "asc" },
    });
  },

  async getAppointmentByUser(filters: { user_id: number }) {
    const { user_id } = filters;

    return await prisma.appointments.findMany({
      where: { user_id: user_id },
      orderBy: { start_time: "asc" },
      include: {
        staff: { select: { name: true } },
        appointment_items: {
          include: {
            services: {
              select: { name: true },
            },
            service_price: {
              select: { label: true },
            },
            appointment_addons: {
              include: {
                service_addons: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });
  },

  async createAppointments(data: AppointmentData) {
    // 提取查詢用的 id (改從 appointment_items 及其內部的 appointment_addons 提取)
    const itemPriceIds = data.appointment_items.map((i) => i.service_price_id);
    const addonIds = data.appointment_items.flatMap((i) =>
      (i.appointment_addons || []).map((a) => a.addon_id)
    );

    // 提取資料庫正確的價格與時間資訊
    const [dbPrices, dbAddons] = await Promise.all([
      prisma.service_prices.findMany({
        where: {
          id: {
            in: itemPriceIds,
          },
        },
        include: { services: true },
      }),
      prisma.service_addons.findMany({
        where: {
          id: {
            in: addonIds,
          },
        },
      }),
    ]);

    // 計算後端應有的時間與價格
    let expectedTotalPrice = 0;
    let expectedTotalDuration = 0;

    data.appointment_items.forEach((item) => {
      // 計算服務項目（service_price）
      const dbPrice = dbPrices.find((p) => p.id === item.service_price_id);
      if (!dbPrice) throw new Error(`無效價格：${item.service_price_id}`);

      expectedTotalPrice += dbPrice.price;
      expectedTotalDuration += dbPrice.services?.duration_minutes || 0;

      // 計算該項目下的加購項目（appointment_addons）
      (item.appointment_addons || []).forEach((addon: AppointmentAddon) => {
        const dbAddon = dbAddons.find((a) => a.id === addon.addon_id);
        if (!dbAddon) throw new Error(`無效的加價項目：${addon.addon_id}`);

        const quantity = addon.quantity || 1;
        expectedTotalPrice += dbAddon.price * quantity;
        expectedTotalDuration += dbAddon.duration_minutes || 0;
      });
    });

    // 比對價格
    if (expectedTotalPrice != data.total_price) {
      throw new Error(
        `金額異常！預期: ${expectedTotalPrice}, 實際收到: ${data.total_price}`
      );
    }

    // 計算時間區間是否足夠
    const startDate = new Date(data.start_time);
    const endDate = new Date(data.end_time);
    const actualDuration =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60); // getTime()拿到毫秒，/1000 * 60變分鐘

    // 如果超過300分鐘的需要用Math.min找較小值比較
    const cappedActualDuration = Math.min(actualDuration, 300);
    const cappedExpectedDuration = Math.min(expectedTotalDuration, 300);
    if (cappedActualDuration !== cappedExpectedDuration) {
      throw new Error(`預約時段不符！需要 ${cappedExpectedDuration} 分鐘`);
    }

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("日期格式錯誤，無法解析時間");
    }

    const newAppointment = await prisma.$transaction(async (tx) => {
      // 檢查預約單中有沒有時段衝突
      const conflict = await tx.appointments.findFirst({
        where: {
          staff_id: data.staff_id,
          status: { not: "cancelled" },
          start_time: { lt: endDate },
          end_time: { gt: startDate },
        },
      });

      if (conflict) throw new Error("該時段美甲師已被預約");
      // 檢查美甲師時間是否真的可以
      const isAvailable = await tx.schedules.findFirst({
        where: {
          staff_id: data.staff_id,
          start_time: { lt: startDate },
          end_time: { gt: endDate },
        },
      });
      if (!isAvailable) throw new Error("該時段美甲師不在班或已請假");

      // 建立預約主表與項目清單
      const appointment = await tx.appointments.create({
        data: {
          start_time: startDate,
          end_time: endDate,
          total_price: data.total_price,
          staff_id: BigInt(data.staff_id),
          user_id: data.user_id ? BigInt(data.user_id) : null,
          note: data.note,
          status: data.status,
          appointment_items: {
            create: data.appointment_items.map((item) => ({
              service_id: Number(item.service_id),
              service_price_id: Number(item.service_price_id),
              price_snapshot: Number(item.price_snapshot),
              duration_snapshot: Number(item.duration_snapshot),
              appointment_addons: {
                create: (item.appointment_addons || []).map((addon) => ({
                  addon_id: Number(addon.addon_id),
                  price_snapshot: Number(addon.price_snapshot),
                  duration_snapshot: Number(addon.duration_snapshot),
                  quantity: Number(addon.quantity || 1),
                })),
              },
            })),
          },
        },
        include: {
          appointment_items: {
            include: { appointment_addons: true },
          },
        },
      });

      // 如果有詢價需求，手動建立並連結 appointment_id
      if (data.quote_request && data.quote_request.image_url) {
        await tx.quote_requests.create({
          data: {
            user_id: data.user_id ? BigInt(data.user_id) : null,
            staff_id: BigInt(data.staff_id),
            image_url: data.quote_request.image_url,
            description: data.quote_request.description || "",
            status: "pending",
            appointment_id: appointment.id,
          },
        });
      }

      return appointment;
    });

    // 發送 LINE 通知
    const lineId = data.line_id;
    if (lineId) {
      const bookingItems = data.appointment_items.map((item) => {
        const dbPrice = dbPrices.find((p) => p.id === item.service_price_id);
        return {
          service_name: dbPrice?.services?.name || "未知服務",
          addons: (item.appointment_addons || []).map((addon) => ({
            name:
              dbAddons.find((a) => a.id === addon.addon_id)?.name || "未知加購",
            quantity: addon.quantity || 1,
          })),
        };
      });

      pushAppointmentNotification(lineId, {
        start_time: startDate,
        appointment_items: bookingItems,
      }).catch((err) => console.error("LINE 通知失敗:", err));
    }

    return newAppointment;
  },
  async handleUserCancellation(id: number, userId: number) {
    const currentAppointment = await prisma.appointments.findUnique({
      where: { id },
    });
    if (!currentAppointment) {
      throw new Error("預約不存在");
    }
    if (BigInt(userId) !== currentAppointment.user_id) {
      throw new Error("沒有權限取消此預約");
    }
    if (currentAppointment.status === "cancelled") {
      throw new Error("此預約已取消");
    }
    const startDate = new Date(currentAppointment.start_time).getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    if (startDate - now < oneWeek) {
      throw new Error("取消預約須於一週前");
    }
    try {
      return await prisma.appointments.update({
        where: { id },
        data: {
          status: appointment_status.cancelled,
        },
      });
    } catch (err) {
      if (err instanceof Error) {
        const message = err instanceof Error ? err.message : "未知錯誤";
        throw new Error(`更新失敗：${message}`);
      }
    }
  },

  async changeStatus(id: number, newStatus: string) {
    const currentAppointment = await prisma.appointments.findUnique({
      where: {
        id,
      },
    });
    if (!currentAppointment) {
      throw new Error("預約不存在");
    }
    if (
      currentAppointment.status !== "confirmed" &&
      currentAppointment.status !== "pending"
    ) {
      throw new Error("結案預約狀態無法修改");
    }
    const aWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    if (currentAppointment.end_time.getTime() < aWeekAgo) {
      throw new Error("已過期預約無法修改");
    }
    if (currentAppointment.status === newStatus) return currentAppointment;
    return await prisma.appointments.update({
      where: { id: id },
      data: {
        status: newStatus as appointment_status,
        quote_requests: {
          updateMany: {
            where: { appointment_id: id },
            data: {
              status: newStatus as quote_status,
            },
          },
        },
      },
      include: {
        quote_requests: true,
      },
    });
  },
};

export { AppointmentService };
