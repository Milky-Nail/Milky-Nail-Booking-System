import { prisma } from "../lib/prisma.js";

export interface Gallery {
  image_url: string;
  title: string;
  price: number;
  description: string;
  tags: string[];
}

const galleryService = {
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
