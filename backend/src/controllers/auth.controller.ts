import * as authService from "../services/auth.service";
import { Request, Response } from "express";
import passport from "../config/passport";
import { users } from "../generated/prisma";
import crypto from "crypto";

// 取亂數函數，用來給state使用，防止CSRF攻擊
const generateRandomState = (length: number): string => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

//lineInit讓cookie設置移至後端，解決前端無法設置httpOnly問題，間接解決點選按紐直接按上一頁導致的靜默登入問題
const lineInit = (req: Request, res: Response) => {
  const state = generateRandomState(16);
  res.clearCookie("line_auth_state", { path: "/" });
  res.cookie("line_auth_state", state, {
    httpOnly: true, //防XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // 防 CSRF
    maxAge: 5 * 60 * 1000,
    path: "/",
  });

  res.json({ state });
};

const lineCallback = async (req: Request, res: Response) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  const { code, state, error } = req.query;
  const savedState = req.cookies.line_auth_state;

  res.clearCookie("line_auth_state", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  if (error) {
    console.log("使用者取消LINE授權:", error);
    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  }

  if (!state || !savedState || state !== savedState) {
    console.error("State驗證失敗，可能發生CSRF攻擊");
    return res.redirect(`${process.env.FRONTEND_URL}/login-failed`);
  }

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/login-failed`);
  }

  try {
    const user = await authService.getLineUserByCode(code as string);

    const token = authService.generateAppToken(user.id, user.role);

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production", //TODO:正式環境必開 HTTPS
      sameSite: "lax",
    });
    res.redirect(`${process.env.FRONTEND_URL}/home`);
  } catch (err) {
    console.error("LINE Login Error:", err);
    res.redirect(`${process.env.FRONTEND_URL}/login-failed`);
  }
};

const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

const googleCallback = [
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login-failed`,
  }),
  (req: Request, res: Response) => {
    const user = req.user as users;
    const token = authService.generateAppToken(user.id, user.role);

    res.cookie("auth_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.redirect(`${process.env.FRONTEND_URL}/home`);
  },
];

const logout = async (req: Request, res: Response) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", //TODO:正式環境必開 HTTPS
    sameSite: "lax",
    path: "/",
  });
  res.clearCookie("line_auth_state", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return res.status(200).json({ message: "登出成功" });
};
export { lineInit, lineCallback, logout, googleLogin, googleCallback };
