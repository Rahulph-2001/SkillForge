import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { IUserWalletTransactionRepository } from '../../../domain/repositories/IUserWalletTransactionRepository';
import { IGetCreditTransactionsUseCase } from './interfaaces/IGetCreditTransactionsUseCase';
import { GetCreditTransactionsRequestDTO, GetCreditTransactionsRequestSchema, GetCreditTransactionsResponseDTO, CreditTransactionDTO } from '../../dto/credit/GetCreditTransactionsDTO';

@injectable()
export class GetCreditTransactionsUseCase implements IGetCreditTransactionsUseCase {
    constructor(
        @inject(TYPES.IUserWalletTransactionRepository) private readonly transactionRepository: IUserWalletTransactionRepository
    ) { }

    async execute(request: GetCreditTransactionsRequestDTO): Promise<GetCreditTransactionsResponseDTO> {
        const validatedRequest = GetCreditTransactionsRequestSchema.parse(request);

        const result = await this.transactionRepository.findCreditTransactions(
            validatedRequest.userId,
            {
                type: validatedRequest.type,
                page: validatedRequest.page,
                limit: validatedRequest.limit,
            }
        );

        const stats = await this.transactionRepository.getCreditStats(validatedRequest.userId);

        const transactionDTOs: CreditTransactionDTO[] = result.transactions.map(t => ({
            id: t.id,
            type: t.type as string,
            amount: t.amount,
            credits: t.metadata?.credits,
            description: t.description ?? null,
            status: t.status as 'PENDING' | 'COMPLETED' | 'FAILED',
            createdAt: t.createdAt.toISOString(),
            metadata: (t.metadata as Record<string, any>) ?? null,
        }));

        return {
            transactions: transactionDTOs,
            pagination: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
            stats,
        };
    }
}
