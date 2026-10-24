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

  async updatequoteRequest(id: number | string, staffReply: string, price: number) {
    if (!id || !staffReply || !staffReply.trim() || price === undefined || price === null) {
      throw new Error("缺少必要參數");
    }
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      throw new Error("價格必須大於0元");
    }
    const quoteId = BigInt(id);

    const currQuote = await prisma.quote_requests.findUnique({
      where: { id: quoteId },
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

    if (!currQuote) {
      throw new Error("找不到該詢價紀錄");
    }

    const lineId = currQuote?.users?.line_id as string;
    try {
      const updateData: any = {
        staff_reply: staffReply.trim(),
        quoted_price: numericPrice,
        replied_at: new Date(),
        status: "confirmed",
      };

      if (currQuote.appointment_id) {
        updateData.appointments = {
          update: {
            total_price: numericPrice,
          },
        };
      }

      const updatedData = await prisma.quote_requests.update({
        where: { id: quoteId },
        data: updateData,
      });

      if (lineId) {
        pushQuoteNotification(lineId, {
          ...currQuote,
          ...updatedData,
        } as unknown as QuoteRequest);
      }

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
