import { prisma } from "../lib/prisma.js";
import axios from "axios";
import jwt from "jsonwebtoken";

interface LineIdToken {
  sub: string;
  name?: string;
  picture?: string;
  email?: string;
}

const getLineUserByCode = async (code: string) => {
  const res = await axios.post(
    "https://api.line.me/oauth2/v2.1/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.LINE_REDIRECT_URI as string,
      client_id: process.env.LINE_CHANNEL_ID as string,
      client_secret: process.env.LINE_CHANNEL_SECRET as string,
    }).toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  // 從id_token來解析使用者資訊
  const decode = jwt.decode(res.data.id_token) as LineIdToken;

  if (!decode || !decode.sub) {
    throw new Error("無法解析LINE使用者資訊");
  }

  const { sub: lineId, email, name, picture } = decode;

  let user = await prisma.users.findUnique({ where: { line_id: lineId } });
  if (!user && email) {
    user = await prisma.users.findUnique({ where: { email: email } });
    if (user) {
      user = await prisma.users.update({
        where: { id: user.id },
        data: {
          line_id: lineId,
          name: user.name || name,
          avatar_url: user.avatar_url || picture,
        },
      });
    }
  }
  if (!user) {
    user = await prisma.users.create({
      data: {
        line_id: lineId,
        avatar_source: "line",
        name: name || "LINE User",
        avatar_url: picture,
        email: email || "",
        role: "user",
      },
    });
  }

  return user;
};

const upsertGoogleUser = async ({
  googleId,
  name,
  email,
  avatar,
}: {
  googleId: string;
  name: string;
  email?: string;
  avatar?: string;
}) => {
  let user = await prisma.users.findUnique({
    where: { google_id: googleId },
  });
  if (!user && email) {
    user = await prisma.users.findUnique({
      where: { email: email },
    });

    if (user) {
      user = await prisma.users.update({
        where: { id: user.id },
        data: {
          google_id: googleId,
          name: user.name || name,
          avatar_url: user.avatar_url || avatar,
        },
      });
    }
  }

  if (!user) {
    return prisma.users.create({
      data: {
        google_id: googleId,
        avatar_source: "google",
        name: name || "Google User",
        email: email || "",
        avatar_url: avatar,
        role: "user",
      },
    });
  }

  return user;
};

const generateAppToken = (userId: bigint, role: string) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export { getLineUserByCode, upsertGoogleUser, generateAppToken };
