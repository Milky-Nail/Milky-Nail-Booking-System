// src/lib/prisma.ts
import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";

const connectionString = `${process.env.DB_URL}`;

// 使用 pg 驅動建立連線池
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 將適配器傳入 PrismaClient
export const prisma = new PrismaClient({ adapter });
