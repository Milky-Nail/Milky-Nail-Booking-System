import { messagingApi } from "@line/bot-sdk";

type FlexComponent = messagingApi.FlexComponent;
export interface bookingData {
  start_time: Date;
  appointment_items: {
    service_name: string;
    addons: { name: string; quantity: number }[];
  }[];
}

interface Appointment {
  user_id: number;
  staff_id: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  start_time: string;
  end_time: string;
  total_price: number;
}
interface User {
  name: string;
  line_id: string;
}
export interface QuoteRequest {
  appointments: Appointment;
  appointment_id: number;
  users: User;
  id: number;
  created_at: Date;
  user_id: number;
  staff_id: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  staff_reply: string;
  replied_at: Date;
  description: string;
  image_url: string;
  quoted_price: number;
}

const { MessagingApiClient } = messagingApi;

const client = new MessagingApiClient({
  channelAccessToken: process.env.LINE_MESSAGE_ACCESS_TOKEN as string,
});

export const pushAppointmentNotification = async (
  lineId: string,
  data: bookingData
) => {
  if (!lineId) return;

  const formattedTime = new Date(data.start_time).toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const itemContents: FlexComponent[] = [];
  data.appointment_items.forEach((item) => {
    itemContents.push({
      type: "text",
      text: `。${item.service_name}`,
      weight: "bold",
      size: "sm",
      margin: "md",
      color: "#E8306E",
    });
    item.addons.forEach((addon) => {
      itemContents.push({
        type: "text",
        text: `   + ${addon.name}${
          addon.quantity > 1 ? ` × ${addon.quantity}` : ""
        }`,
        size: "xs",
        color: "#E8306E",
        margin: "xs",
      });
    });
  });

  const flexContainer: any = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "您已預約Milky Nail美甲服務",
          weight: "bold",
          size: "lg",
          color: "#EB5A8B",
        },
        { type: "separator", margin: "md" },
        {
          type: "box",
          layout: "vertical",
          margin: "md",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: `預約時間：${formattedTime}`,
              size: "sm",
              color: "#E8306E",
              weight: "bold",
            },
            ...itemContents,
            {
              type: "text",
              text: "期待您的到來～",
              size: "sm",
              color: "#E8306E",
              weight: "bold",
            },
          ],
        },
      ],
    },
  };
  try {
    await client.pushMessage({
      to: lineId,
      messages: [
        {
          type: "flex",
          altText: "您已預約服務",
          contents: flexContainer,
        },
      ],
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      const errorWithBody = err as { body?: string };
      if (errorWithBody.body) {
        try {
          const detail = JSON.parse(errorWithBody.body);
          console.error("LINE API 錯誤細節:", JSON.stringify(detail, null, 2));
        } catch {
          console.error("無法解析的錯誤內容:", errorWithBody.body);
        }
      } else {
        console.error("發送訊息失敗:", err.message);
      }
    } else {
      console.error("發生未知類型錯誤:", err);
    }
  }
};

export const pushQuoteNotification = async (
  lineId: string,
  quote: QuoteRequest
) => {
  if (!lineId) return;

  const formattedTime = new Date(quote.appointments.start_time).toLocaleString(
    "zh-TW",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );
  const flexContainer: any = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: `親愛的${quote.users.name}，您好！`,
          weight: "bold",
          size: "lg",
          color: "#EB5A8B",
        },
        {
          type: "text",
          text: "您預約的Milky Nail傳圖報價如下：",
          weight: "bold",
          size: "md",
          color: "#EB5A8B",
        },
        { type: "separator", margin: "md" },
        {
          type: "box",
          layout: "vertical",
          margin: "md",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: `預約時間：${formattedTime}`,
              size: "sm",
              color: "#E8306E",
              weight: "bold",
            },
            {
              type: "image",
              url: quote.image_url,
              size: "full",
              aspectRatio: "20:13",
              aspectMode: "cover",
            },
            {
              type: "text",
              text: `美甲師訊息：${quote.staff_reply}`,
              size: "sm",
              color: "#E8306E",
              weight: "bold",
            },
            {
              type: "text",
              text: `價格：${quote.quoted_price}`,
              size: "sm",
              color: "#E8306E",
              weight: "bold",
            },
            {
              type: "text",
              text: "期待您的到來～",
              size: "sm",
              color: "#E8306E",
              weight: "bold",
            },
          ],
        },
      ],
    },
  };
  try {
    await client.pushMessage({
      to: lineId,
      messages: [
        {
          type: "flex",
          altText: "已為您確認預約服務，以下是詳細資訊：",
          contents: flexContainer,
        },
      ],
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      const errorWithBody = err as { body?: string };
      if (errorWithBody.body) {
        try {
          const detail = JSON.parse(errorWithBody.body);
          console.error("LINE API 錯誤細節:", JSON.stringify(detail, null, 2));
        } catch {
          console.error("無法解析的錯誤內容:", errorWithBody.body);
        }
      } else {
        console.error("發送訊息失敗:", err.message);
      }
    } else {
      console.error("發生未知類型錯誤:", err);
    }
  }
};
