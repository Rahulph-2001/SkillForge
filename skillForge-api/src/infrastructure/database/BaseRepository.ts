import { PrismaClient, Prisma } from '@prisma/client';
import { Database } from './Database';

type ModelName = keyof Omit<PrismaClient, '$connect' | '$disconnect' | '$transaction' | '$queryRaw' | '$executeRaw'>;

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;

  constructor(db: Database, protected model: ModelName) {
    this.prisma = db.getClient();
  }

 
  protected async create(data: Prisma.SelectSubset<T, Prisma.Args<T, 'create'>>): Promise<T> {
   
    const modelClient = (this.prisma as any)[this.model];
    return modelClient.create({ data }) as T;
  }

  
  protected async findById(id: string): Promise<T | null> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    return modelClient.findUnique({ where: { id } }) as T | null;
  }

  
  protected async findByEmail(email: string): Promise<T | null> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    return modelClient.findUnique({ where: { email } }) as T | null;
  }

  
  protected async findAll(): Promise<T[]> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    return modelClient.findMany() as T[];
  }

  
  protected async updateById(id: string, data: Prisma.SelectSubset<T, Prisma.Args<T, 'update'>>): Promise<T> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    return modelClient.update({ where: { id }, data }) as T;
  }

 
  protected async delete(id: string): Promise<void> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    await modelClient.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
  }

  
  protected async getOne(query: Record<string, unknown>): Promise<T | null> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    const result = await modelClient.findFirst(query);
    return result || null;
  }
}