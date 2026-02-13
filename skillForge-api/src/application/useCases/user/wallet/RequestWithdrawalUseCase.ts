import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/di/types';
import { IRequestWithdrawalUseCase } from './interfaces/IRequestWithdrawalUseCase';
import { RequestWithdrawalDTO, RequestWithdrawalSchema } from '../../../dto/credit/CreditRedemptionDTO';
import { WithdrawalRequestResponseDTO } from '../../../dto/credit/WithdrawalRequestResponseDTO';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { IWithdrawalRequestRepository } from '../../../../domain/repositories/IWithdrawalRequestRepository';
import { WithdrawalRequest, WithdrawalStatus } from '../../../../domain/entities/WithdrawalRequest';
import { UserWalletTransactionType, UserWalletTransactionStatus } from '../../../../domain/entities/UserWalletTransaction';
import { NotFoundError, ValidationError } from '../../../../domain/errors/AppError';
import { ERROR_MESSAGES } from '../../../../config/messages';
import { Database } from '../../../../infrastructure/database/Database';
import { IWithdrawalRequestMapper } from '../../../mappers/interfaces/IWithdrawalRequestMapper';

@injectable()
export class RequestWithdrawalUseCase implements IRequestWithdrawalUseCase {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
        @inject(TYPES.IWithdrawalRequestRepository) private readonly withdrawalRepository: IWithdrawalRequestRepository,
        @inject(TYPES.IWithdrawalRequestMapper) private readonly withdrawalMapper: IWithdrawalRequestMapper,
        @inject(TYPES.Database) private readonly db: Database
    ) { }

    async execute(userId: string, data: RequestWithdrawalDTO): Promise<WithdrawalRequestResponseDTO> {
        const validatedData = RequestWithdrawalSchema.parse(data);

        return await this.db.getClient().$transaction(async (tx) => {
            // 1. Fetch User
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new NotFoundError(ERROR_MESSAGES.USER.NOT_FOUND);
            }

            // 2. Validate Balance
            if (Number(user.walletBalance) < validatedData.amount) {
                throw new ValidationError('Insufficient wallet balance for withdrawal');
            }

            // 3. Deduct from Wallet
            await tx.user.update({
                where: { id: userId },
                data: {
                    walletBalance: { decrement: validatedData.amount },
                },
            });

            // 4. Create Withdrawal Request
            const withdrawalRequest = await tx.withdrawalRequest.create({
                data: {
                    userId: userId,
                    amount: validatedData.amount,
                    currency: validatedData.currency || 'INR',
                    status: WithdrawalStatus.PENDING,
                    bankDetails: validatedData.bankDetails,
                },
            });

            // 5. Log Transaction
            await tx.userWalletTransaction.create({
                data: {
                    userId: userId,
                    type: UserWalletTransactionType.WITHDRAWAL_REQUEST,
                    amount: -validatedData.amount, // Negative for withdrawal
                    currency: validatedData.currency || 'INR',
                    status: UserWalletTransactionStatus.PENDING, // Pending until approved/processed
                    source: 'SYSTEM',
                    referenceId: withdrawalRequest.id,
                    description: `Withdrawal request for ${validatedData.currency} ${validatedData.amount}`,
                    previousBalance: Number(user.walletBalance),
                    newBalance: Number(user.walletBalance) - validatedData.amount,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });

            // Need to map the Prisma result to Domain Entity to use Mapper
            // Or ideally repository should have been used inside transaction, but Prisma extension limitation.
            // We manually map here for response.
            return this.withdrawalMapper.toResponseDTO(new WithdrawalRequest({
                id: withdrawalRequest.id,
                userId: withdrawalRequest.userId,
                amount: Number(withdrawalRequest.amount),
                currency: withdrawalRequest.currency,
                status: withdrawalRequest.status as WithdrawalStatus,
                bankDetails: withdrawalRequest.bankDetails as Record<string, any>,
                createdAt: withdrawalRequest.createdAt,
                updatedAt: withdrawalRequest.updatedAt,
            }));
        });
    }
}
