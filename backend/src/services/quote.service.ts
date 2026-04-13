import { prisma } from "../lib/prisma.js";
import { pushQuoteNotification, QuoteRequest } from "./lineMessage.service.js";
export interface PaginationQuery {
  page?: number;
  limit?: number;
}
const QuoteRequestService = {
  async getQuoteRequest(pagination: PaginationQuery = {}) {
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const skip = (page - 1) * limit;
    try {
      const quoteRequests = await prisma.quote_requests.findMany({
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          appointments: {
            select: {
              start_time: true,
              end_time: true,
              total_price: true,
              staff_id: true,
              user_id: true,
              status: true,
            },
          },
          users: {
            select: {
              name: true,
            },
          },
        },
      });
      const totalCount = await prisma.quote_requests.count();
      return { data: quoteRequests, totalCount };
    } catch (err) {
      if (err instanceof Error) {
        const message = err instanceof Error ? err.message : "未知錯誤";
        throw new Error(`獲取失敗：${message}`);
      }
    }
  },

  async updatequoteRequest(id: number, staffReply: string, price: number) {
    const currQuote = await prisma.quote_requests.findUnique({
      where: { id },
      include: {
        appointments: {
          select: {
            user_id: true,
            staff_id: true,
            status: true,
            start_time: true,
            end_time: true,
            total_price: true,
          },
        },
        users: {
          select: {
            name: true,
            line_id: true,
          },
        },
      },
    });
    const lineId = currQuote?.users?.line_id as string;
    const numericPrice = Number(price); //所有的 URL 參數在後端解析時預設都是字串
    if (!id || !staffReply.trim() || !price) {
      throw new Error("缺少必要參數");
    }
    if (typeof numericPrice !== "number" || price <= 0) {
      throw new Error("價格必須大於0元");
    }
    try {
      const updatedData = await prisma.quote_requests.update({
        where: { id },
        data: {
          staff_reply: staffReply.trim(),
          quoted_price: numericPrice,
          replied_at: new Date(),
          appointments: {
            update: {
              total_price: numericPrice,
            },
          },
        },
      });

      pushQuoteNotification(lineId, {
        ...currQuote,
        ...updatedData,
      } as unknown as QuoteRequest);

      return updatedData;
    } catch (err) {
      if (err instanceof Error) {
        const message = err.message;
        throw new Error(`更新失敗：${message}`);
      }
      throw new Error(`更新失敗：${err}`);
    }
  },
};

export { QuoteRequestService };
