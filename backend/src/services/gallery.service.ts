import { prisma } from "../lib/prisma.js";

export interface Gallery {
  image_url: string;
  title: string;
  price: number;
  description: string;
  tags: string[];
}

export interface WorkFilter {
  tag?: string | undefined;
  price?: number;
  pagination?: {
    page?: number;
    limit?: number;
  };
}

export interface Work {
  id: string;
  title: string;
  image_url: string;
  price: number;
  tags: string[];
  description: string;
  created_at: Date;
}

const galleryService = {
  async getWorks(filter: WorkFilter) {
    const page = Number(filter.pagination?.page) || 1;
    const limit = Number(filter.pagination?.limit) || 10;
    const skip = (page - 1) * limit;
    const tag = filter.tag;
    const price = Number(filter.price);

    try {
      const [data, total] = await Promise.all([
        await prisma.post.findMany({
          where: {
            AND: [
              tag ? { tags: { has: tag } } : {},
              price ? { price: price } : {},
            ],
          },
          orderBy: { created_at: "desc" },
          skip: skip,
          take: limit,
        }),
        await prisma.post.count(),
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
  async showWorkOrNot(id: string, status: boolean) {
    try {
      if (typeof status !== "boolean") {
        throw new Error("狀態改變型別不符");
      }
      const res = await prisma.post.update({
        where: {
          id,
        },
        data: {
          is_showed: status,
        },
      });
      return res;
    } catch (err) {
      if (err instanceof Error) {
        const message = err instanceof Error ? err.message : "未知錯誤";
        throw new Error(`獲取失敗：${message}`);
      }
    }
  },
  async uploadWork(data: Gallery) {
    try {
      const res = await prisma.post.create({
        data: {
          image_url: data.image_url,
          title: data.title,
          price: Number(data.price),
          description: data.description,
          tags: data.tags,
        },
      });
      return res;
    } catch (err) {
      const message = err instanceof Error ? err.message : "上傳失敗";
      throw new Error(message);
    }
  },
};

export { galleryService };
