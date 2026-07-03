import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// For Prisma 7, you need to provide either an adapter or accelerateUrl
// If using Prisma Accelerate, pass accelerateUrl
// If using a direct connection with an adapter, configure it here
export const db = globalForPrisma.prisma ?? new PrismaClient({
  // Remove this if you're not using Prisma Accelerate
  // accelerateUrl: process.env.ACCELERATE_URL,
} as any);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
