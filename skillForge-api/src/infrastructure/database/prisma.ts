import { PrismaClient } from '@prisma/client';


class PrismaService {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' 
          ? ['query', 'error', 'warn'] 
          : ['error'],
      });

     
      process.on('beforeExit', async () => {
        await PrismaService.disconnect();
      });
    }
    return PrismaService.instance;
  }

  public static async disconnect(): Promise<void> {
    if (PrismaService.instance) {
      await PrismaService.instance.$disconnect();
      console.log('Prisma disconnected');
    }
  }
}

export const prisma = PrismaService.getInstance();
export default PrismaService;
