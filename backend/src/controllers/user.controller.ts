import { Request, Response } from "express";
import { updateUserSchema } from "src/validators/user.validator";
import { UserService } from "src/services/user.service";

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const user = await UserService.getUserById(req.userId!);
    if (!user) {
      return res.status(404).json({ message: "找不到使用者" });
    }

    res.json({
      ...user,
      id: user.id.toString(),
    });
  } catch (err) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
};

export const getList = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  try {
    const result = await UserService.getAllUsers({
      page: Number(page),
      limit: Number(limit),
    });
    const formattedUsers = result!.data.map((user) => ({
      ...user,
      id: user.id.toString(),
    }));
    res
      .status(200)
      .json({ data: formattedUsers, pagination: result?.pagination });
  } catch (err) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "資料格式錯誤", errors: parsed.error.flatten() });
  }
  const userId = req.userId!;

  try {
    const updated = await UserService.updateUserProfile(userId, parsed.data);
    return res.json({ message: "更新成功", data: updated });
  } catch (err) {
    const statusMap: Record<string, number> = {
      USER_NOT_FOUND: 404,
      EMAIL_ALREADY_TAKEN: 409,
    };
    if (err instanceof Error) {
      const status = statusMap[err.message] ?? 500;
      return res.status(status).json({ message: err.message });
    }
  }
};
export const changeUserRoleController = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const newRole = req.body.role;
  try {
    const updatedUser = await UserService.changeUserRole(
      userId as string,
      newRole
    );
    return res.status(200).json({ message: "更新成功", data: updatedUser });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }
};
export const changeUserBlockStatusController = async (
  req: Request,
  res: Response
) => {
  const userId = req.params.userId;
  const newStatus = req.body.is_blocked;
  try {
    const updatedUser = await UserService.changeUserBlockStatus(
      userId as string,
      newStatus
    );
    return res.status(200).json({ message: "更新成功", data: updatedUser });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }
};
