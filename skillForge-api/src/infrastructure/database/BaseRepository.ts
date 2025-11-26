import { PrismaClient, Prisma } from '@prisma/client';
import { Database } from './Database';

type ModelName = keyof Omit<PrismaClient, '$connect' | '$disconnect' | '$transaction' | '$queryRaw' | '$executeRaw'>;

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;

  constructor(db: Database, protected model: ModelName) {
    this.prisma = db.getClient();
  }

  /**
   * Creates a new record in the database.
   * 
   * @param data The data to be inserted into the database.
   * @returns The newly created record.
   */
  protected async create(data: Prisma.SelectSubset<T, Prisma.Args<T, 'create'>>): Promise<T> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    return modelClient.create({ data }) as T;
  }

  /**
   * Retrieves a record from the database by its ID.
   * 
   * @param id The ID of the record to be retrieved.
   * @returns The record with the specified ID, or null if not found.
   */
  protected async findById(id: string): Promise<T | null> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    return modelClient.findUnique({ where: { id } }) as T | null;
  }

  /**
   * Retrieves a record from the database by its email.
   * 
   * @param email The email of the record to be retrieved.
   * @returns The record with the specified email, or null if not found.
   */
  protected async findByEmail(email: string): Promise<T | null> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    return modelClient.findUnique({ where: { email } }) as T | null;
  }

  /**
   * Retrieves all records from the database.
   * 
   * @returns An array of all records in the database.
   */
  protected async findAll(): Promise<T[]> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    return modelClient.findMany() as T[];
  }

  /**
   * Updates a record in the database by its ID.
   * 
   * @param id The ID of the record to be updated.
   * @param data The updated data.
   * @returns The updated record.
   */
  protected async updateById(id: string, data: Prisma.SelectSubset<T, Prisma.Args<T, 'update'>>): Promise<T> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    return modelClient.update({ where: { id }, data }) as T;
  }

  /**
   * Deletes a record from the database by its ID.
   * 
   * @param id The ID of the record to be deleted.
   */
  protected async delete(id: string): Promise<void> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    await modelClient.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } });
  }

  /**
   * Retrieves a record from the database based on a query.
   * 
   * @param query The query to be used for retrieval.
   * @returns The record that matches the query, or null if not found.
   */
  protected async getOne(query: Record<string, unknown>): Promise<T | null> {
    // Using 'any' here is necessary for Prisma's dynamic model access pattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const modelClient = (this.prisma as any)[this.model];
    const result = await modelClient.findFirst(query);
    return result || null;
  }
}