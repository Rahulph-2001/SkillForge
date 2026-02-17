import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { IWalletTransactionRepository } from '../../../domain/repositories/IWalletTransactionRepository';
import { WalletTransaction } from '../../../domain/entities/WalletTransaction';

@injectable()
export class WalletTransactionRepository implements IWalletTransactionRepository {
  constructor(@inject(TYPES.Database) private readonly db: Database) { }

  async create(transaction: WalletTransaction): Promise<WalletTransaction> {
    const data = transaction.toJSON();
    const created = await this.db.getClient().walletTransaction.create({
      data: {
        id: data.id,
        adminId: data.adminId,
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        source: data.source,
        referenceId: data.referenceId,
        description: data.description,
        metadata: data.metadata,
        previousBalance: data.previousBalance,
        newBalance: data.newBalance,
        status: data.status,
      },
    });
    return WalletTransaction.fromDatabaseRow(created);
  }

  async findById(id: string): Promise<WalletTransaction | null> {
    const transaction = await this.db.getClient().walletTransaction.findUnique({
      where: { id },
    });
    return transaction ? WalletTransaction.fromDatabaseRow(transaction) : null;
  }

  async findByAdminId(
    adminId: string,
    page: number,
    limit: number
  ): Promise<{ transactions: WalletTransaction[]; total: number }> {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.db.getClient().walletTransaction.findMany({
        where: { adminId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.db.getClient().walletTransaction.count({
        where: { adminId },
      }),
    ]);

    return {
      transactions: transactions.map((t: any) => WalletTransaction.fromDatabaseRow(t)),
      total,
    };
  }

  async findByAdminIdWithFilters(
    adminId: string,
    page: number,
    limit: number,
    filters?: {
      type?: 'CREDIT' | 'WITHDRAWAL';
      source?: string;
      status?: 'COMPLETED' | 'PENDING' | 'FAILED';
      search?: string;
    }
  ): Promise<{ transactions: WalletTransaction[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: any = { adminId };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.source) {
      where.source = filters.source;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { description: { contains: filters.search, mode: 'insensitive' } },
        { source: { contains: filters.search, mode: 'insensitive' } },
        { referenceId: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [transactions, total] = await Promise.all([
      this.db.getClient().walletTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.db.getClient().walletTransaction.count({ where }),
    ]);

    return {
      transactions: transactions.map((t: any) => WalletTransaction.fromDatabaseRow(t)),
      total,
    };
  }
}