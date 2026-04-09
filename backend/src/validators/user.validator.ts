import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  phone: z
    .string()
    .regex(/^09\d{8}$/, "手機號碼格式錯誤")
    .optional(),
  email: z.string().email("Email格式錯誤").optional(),
  avatar_url: z.string().url().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
