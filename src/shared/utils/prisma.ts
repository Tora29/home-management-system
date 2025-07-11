import { PrismaClient } from '@prisma/client';

/**
 * グローバルオブジェクトに型安全にPrismaClientを追加するための型定義
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prismaクライアントのインスタンス
 * 開発環境では接続を再利用し、本番環境では新しいインスタンスを作成
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// 開発環境でのホットリロード時に接続を再利用
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;