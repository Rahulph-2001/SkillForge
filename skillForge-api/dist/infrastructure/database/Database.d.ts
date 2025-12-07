import { PrismaClient, Prisma } from '@prisma/client';
export declare class Database {
    private static instance;
    private prisma;
    private constructor();
    static getInstance(): Database;
    getClient(): PrismaClient;
    transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
    close(): Promise<void>;
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=Database.d.ts.map