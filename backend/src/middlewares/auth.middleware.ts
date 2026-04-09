import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface TokenPayload extends JwtPayload {
  id: string;
  role: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: "未登入，請先登入" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;
    if (!decoded.userId) {
      console.error("JWT 內缺少 id 欄位");
      return res.status(401).json({ message: "Token 格式錯誤" });
    }
    if (!decoded.role) {
      console.error("JWT 內缺少 role 欄位");
      return res.status(401).json({ message: "Token 格式錯誤" });
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    const error = err as Error;
    console.error("JWT 驗證失敗:", error.message);
    return res.status(401).json({ message: "身份驗證無效，請重新登入" });
  }
};

export const authMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ message: "未提供 Token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token 無效或已過期" });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ message: "未提供 Token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.role = decoded.role;
    if (req.role !== "admin") {
      return res.status(403).json({ message: "權限不足，僅限管理員存取" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token 無效或已過期" });
  }
};
