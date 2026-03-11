import { prisma } from "../lib/prisma.js";
import { appointment_status } from "../generated/prisma/index.js";
export interface AppointmentItem {
  service_id: number;
  service_price_id: number;
  price_snapshot: number;
  duration_snapshot: number;
}
export interface AppointmentAddon {
  addon_id: number;
  price_snapshot: number;
  duration_snapshot: number;
}
export interface AppointmentData {
  user_id: number;
  staff_id: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  start_time: string;
  end_time: string;
  total_price: number;
  note: string;
  items: AppointmentItem[];
  addons: AppointmentAddon[];
}

const AppointmentService = {
  async getAppointment(filters: { staff_id: number; date: string }) {
    console.log("後端收到的查詢參數:", filters); //TODO:記得刪
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

  async createAppointments(data: AppointmentData) {
    //提取查詢用的id
    const itemPriceIds = data.items.map((i) => i.service_price_id);
    const addonIds = data.addons.map((a) => a.addon_id);
    //提取資料庫正確的價格與時間資訊
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

    // 計算服務項目（service_price）
    data.items.forEach((item) => {
      const dbPrice = dbPrices.find((p) => p.id === item.service_price_id);
      if (!dbPrice) throw new Error(`無效價格：${item.service_price_id}`);
      // 計算總應有價格
      expectedTotalPrice += dbPrice.price;
      expectedTotalDuration += dbPrice.services?.duration_minutes || 0;
    });
    // 計算加購項目（addon）
    data.addons.forEach((addon) => {
      const dbAddon = dbAddons.find((a) => a.id === addon.addon_id);
      if (!dbAddon) throw new Error(`無效的加價項目：${addon.addon_id}`);
      expectedTotalPrice += dbAddon.price;
      expectedTotalDuration += dbAddon.duration_minutes || 0;
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
      (endDate.getTime() - startDate.getTime()) / (1000 * 60); //getTime()拿到毫秒，/1000 * 60變分鐘

    if (actualDuration < expectedTotalDuration) {
      throw new Error(`預約時段不足！至少需要 ${expectedTotalDuration} 分鐘`);
    }
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("日期格式錯誤，無法解析時間");
    }
    // 檢查美甲師時段是否衝突
    const conflict = await prisma.appointments.findFirst({
      where: {
        staff_id: data.staff_id,
        status: { not: "cancelled" as appointment_status },
        start_time: { lt: endDate }, //現有預約的開始時間在新預約結束時間之前
        end_time: { gt: startDate }, //現有預約的結束時間在新預約開始時間之前
        // 兩個條件都成立的話就是衝突
      },
    });
    if (conflict) {
      throw new Error("該時段美甲師已被預約");
    }
    return await prisma.appointments.create({
      data: {
        start_time: startDate,
        end_time: endDate,
        total_price: data.total_price,
        staff_id: BigInt(data.staff_id),
        user_id: data.user_id ? BigInt(data.user_id) : null, //保留訪客預約的可能
        note: data.note,
        status: data.status,
        appointment_items: {
          createMany: {
            data: data.items.map((item) => ({
              //包個()表示我是要回傳整個物件，而不是執行{}中的指令
              service_id: Number(item.service_id),
              service_price_id: Number(item.service_price_id),
              price_snapshot: Number(item.price_snapshot),
              duration_snapshot: Number(item.duration_snapshot),
            })),
          },
        },
        appointment_addons: {
          createMany: {
            data: data.addons.map((addon) => ({
              addon_id: Number(addon.addon_id),
              price_snapshot: Number(addon.price_snapshot),
              duration_snapshot: Number(addon.duration_snapshot),
            })),
          },
        },
      },
      include: {
        appointment_items: true,
        appointment_addons: true,
      },
    });
  },
};

export { AppointmentService };
