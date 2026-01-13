// skillForge-api/src/infrastructure/services/TransactionService.ts
import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { ITransactionService, TransactionRepositories } from '../../domain/services/ITransactionService';
import { Database } from '../database/Database';
import { Prisma } from '@prisma/client';
import { UserRepository } from '../database/repositories/UserRepository';
import { CommunityRepository } from '../database/repositories/CommunityRepository';
import { UsageRecordRepository } from '../database/repositories/UsageRecordRepository';

@injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @inject(TYPES.Database) private readonly database: Database
  ) {}

  async execute<T>(
    callback: (repositories: TransactionRepositories) => Promise<T>
  ): Promise<T> {
    return await this.database.transaction(async (tx: Prisma.TransactionClient) => {
      // Create repository instances and inject transaction client
      // This ensures all operations within the callback use the same transaction
      const userRepository = new UserRepository(this.database);
      userRepository.setTransactionClient(tx);

      const communityRepository = new CommunityRepository(this.database);
      communityRepository.setTransactionClient(tx);

      const usageRecordRepository = new UsageRecordRepository(this.database);
      usageRecordRepository.setTransactionClient(tx);

      const repositories: TransactionRepositories = {
        userRepository,
        communityRepository,
        usageRecordRepository,
      };

      return await callback(repositories);
    });
  }
}