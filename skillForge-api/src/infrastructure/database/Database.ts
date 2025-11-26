import { PrismaClient, Prisma } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

export class Database {
  private static instance: Database;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
    this.prisma.$on('error' as never, (e: any) => {
      console.error('Prisma Client error:', e);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  public async transaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return await this.prisma.$transaction(callback);
  }

  public async close(): Promise<void> {
    await this.prisma.$disconnect();
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }
}