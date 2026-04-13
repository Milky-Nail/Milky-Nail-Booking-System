import { prisma } from "../lib/prisma.js";
import { UpdateUserDto } from "../validators/user.validator.js";

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

const UserService = {
  async getUserById(id: string) {
    return await prisma.users.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true,
        avatar_source: true,
        avatar_url: true,
        email: true,
        google_id: true,
        line_id: true,
        name: true,
        phone: true,
        role: true,
      },
    });
  },

  async getAllUsers(pagination: PaginationQuery = {}) {
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 10;
    const skip = (page - 1) * limit;
    try {
      const [data, total] = await Promise.all([
        prisma.users.findMany({
          skip,
          take: limit,
          orderBy: { id: "asc" },
          select: {
            id: true,
            avatar_source: true,
            avatar_url: true,
            email: true,
            google_id: true,
            line_id: true,
            name: true,
            phone: true,
            role: true,
            is_blocked: true,
          },
        }),
        prisma.users.count(),
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

  async updateUserProfile(userId: string, dto: UpdateUserDto) {
    const user = await prisma.users.findUnique({
      where: { id: BigInt(userId) },
    });
    if (!user) throw new Error("找不到使用者");

    if (dto.email && dto.email !== user.email) {
      const existing = await prisma.users.findUnique({
        where: { email: dto.email },
      });
      if (existing) throw new Error("該Email已被註冊過");
    }
    return prisma.users.update({
      where: { id: BigInt(userId) },
      data: dto,
      select: {
        name: true,
        avatar_url: true,
        phone: true,
        email: true,
        role: true,
      },
    });
  },

  async changeUserRole(userId: string, newRole: string) {
    const user = await prisma.users.findUnique({
      where: { id: BigInt(userId) },
    });
    if (!user) throw new Error("找不到使用者");
    return prisma.users.update({
      where: { id: BigInt(userId) },
      data: { role: newRole as "user" | "admin" | "technician" },
    });
  },
  async changeUserBlockStatus(userId: string, newStatus: boolean) {
    const user = await prisma.users.findUnique({
      where: { id: BigInt(userId) },
    });
    if (!user) throw new Error("找不到使用者");
    return prisma.users.update({
      where: { id: BigInt(userId) },
      data: { is_blocked: newStatus }, //TODO:增加blocked_user欄位update
    });
  },
};

export { UserService };
