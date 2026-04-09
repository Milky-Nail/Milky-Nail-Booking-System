import { users } from "../generated/prisma";
export {};

declare global {
  interface BigInt {
    toJSON(): string;
  }

  namespace Express {
    interface User extends users {}
    interface Request {
      user?: users;
      userId?: string;
      role?: string;
    }
  }
}
