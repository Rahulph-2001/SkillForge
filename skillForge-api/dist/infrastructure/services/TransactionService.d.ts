import { ITransactionService, TransactionRepositories } from '../../domain/services/ITransactionService';
import { Database } from '../database/Database';
export declare class TransactionService implements ITransactionService {
    private readonly database;
    constructor(database: Database);
    execute<T>(callback: (repositories: TransactionRepositories) => Promise<T>): Promise<T>;
}
//# sourceMappingURL=TransactionService.d.ts.map