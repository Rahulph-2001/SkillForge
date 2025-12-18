import { PrismaClient, Prisma } from '@prisma/client';
import { Database } from './Database';
type ModelName = keyof Omit<PrismaClient, '$connect' | '$disconnect' | '$transaction' | '$queryRaw' | '$executeRaw'>;
export declare abstract class BaseRepository<T> {
    protected model: ModelName;
    protected prisma: PrismaClient;
    constructor(db: Database, model: ModelName);
    protected create(data: Prisma.SelectSubset<T, Prisma.Args<T, 'create'>>): Promise<T>;
    protected findById(id: string): Promise<T | null>;
    protected findByEmail(email: string): Promise<T | null>;
    protected findAll(): Promise<T[]>;
    protected updateById(id: string, data: Prisma.SelectSubset<T, Prisma.Args<T, 'update'>>): Promise<T>;
    protected delete(id: string): Promise<void>;
    protected getOne(query: Record<string, unknown>): Promise<T | null>;
}
export {};
//# sourceMappingURL=BaseRepository.d.ts.map