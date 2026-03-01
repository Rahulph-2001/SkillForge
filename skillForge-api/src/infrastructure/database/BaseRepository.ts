import { type PrismaClient, type Prisma } from '@prisma/client';
import { type Database } from './Database';

type ModelName = keyof Omit<PrismaClient, '$connect' | '$disconnect' | '$transaction' | '$queryRaw' | '$executeRaw'>;

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient | Prisma.TransactionClient;

  constructor(db: Database, protected model: ModelName) {
    this.prisma = db.getClient();
  }

  /**
   * Set transaction client for atomic operations
   * @internal Used by TransactionService
   */
  public setTransactionClient(client: Prisma.TransactionClient): void {
    this.prisma = client;
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async create(data: any): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
     
    return (await modelClient.create({ data })) as T;
  }


  protected async findById(id: string): Promise<T | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
     
    return ((await modelClient.findUnique({ where: { id } })) as T | null);
  }


  protected async findByEmail(email: string): Promise<T | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
     
    return ((await modelClient.findUnique({ where: { email } })) as T | null);
  }


  protected async findAll(): Promise<T[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
     
    return ((await modelClient.findMany()) as T[]);
  }


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async updateById(id: string, data: any): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
     
    return ((await modelClient.update({ where: { id }, data })) as T);
  }


  protected async delete(id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
     
    await modelClient.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
  }


  protected async getOne(query: Record<string, unknown>): Promise<T | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
     
    const result = await (modelClient.findFirst(query) as Promise<T | null>);
    return result || null;
  }
}