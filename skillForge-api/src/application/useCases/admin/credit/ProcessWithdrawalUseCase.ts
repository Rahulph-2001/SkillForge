import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/di/types';
import { IProcessWithdrawalUseCase } from './interfaces/IProcessWithdrawalUseCase';
import { ProcessWithdrawalDTO, ProcessWithdrawalSchema } from '../../../dto/credit/CreditRedemptionDTO';
import { WithdrawalRequestResponseDTO } from '../../../dto/credit/WithdrawalRequestResponseDTO';
import { IWithdrawalRequestRepository } from '../../../../domain/repositories/IWithdrawalRequestRepository';
import { IWithdrawalRequestMapper } from '../../../mappers/interfaces/IWithdrawalRequestMapper';
import { Database } from '../../../../infrastructure/database/Database';
import { NotFoundError, ValidationError } from '../../../../domain/errors/AppError';
import { WithdrawalStatus, WithdrawalRequest } from '../../../../domain/entities/WithdrawalRequest';
import { UserWalletTransactionType, UserWalletTransactionStatus } from '../../../../domain/entities/UserWalletTransaction';

@injectable()
export class ProcessWithdrawalUseCase implements IProcessWithdrawalUseCase {
    constructor(
        @inject(TYPES.IWithdrawalRequestRepository) private readonly withdrawalRepository: IWithdrawalRequestRepository,
        @inject(TYPES.IWithdrawalRequestMapper) private readonly withdrawalMapper: IWithdrawalRequestMapper,
        @inject(TYPES.Database) private readonly db: Database
    ) { }

    async execute(adminId: string, data: ProcessWithdrawalDTO): Promise<WithdrawalRequestResponseDTO> {
        const validatedData = ProcessWithdrawalSchema.parse(data);

        return await this.db.getClient().$transaction(async (tx) => {
            // 1. Fetch Request
            const requestData = await tx.withdrawalRequest.findUnique({ where: { id: validatedData.withdrawalId } });
            if (!requestData) {
                throw new NotFoundError('Withdrawal request not found');
            }

            // Manually map to Domain Entity because Repository method returns Domain Entity but we are inside raw Prisma transaction
            // Ideally we should have a `findById` on the repository that accepts a transaction client, or use the repository outside
            // But we need locking/atomicity.
            // For now, let's reconstruct the entity.
            const request = new WithdrawalRequest({
                id: requestData.id,
                userId: requestData.userId,
                amount: Number(requestData.amount),
                currency: requestData.currency,
                status: requestData.status as WithdrawalStatus,
                bankDetails: requestData.bankDetails as Record<string, any>,
                adminNote: requestData.adminNote,
                processedBy: requestData.processedBy,
                processedAt: requestData.processedAt,
                transactionId: requestData.transactionId,
                createdAt: requestData.createdAt,
                updatedAt: requestData.updatedAt
            });

            if (request.status !== WithdrawalStatus.PENDING) {
                throw new ValidationError('Request is already processed');
            }

            if (validatedData.action === 'APPROVE') {
                if (!validatedData.transactionId) {
                    throw new ValidationError('Transaction ID is required for approval');
                }

                // Update Request Status
                await tx.withdrawalRequest.update({
                    where: { id: request.id },
                    data: {
                        status: WithdrawalStatus.PROCESSED,
                        processedBy: adminId,
                        processedAt: new Date(),
                        transactionId: validatedData.transactionId,
                        adminNote: validatedData.adminNote
                    }
                });

                // Update Transaction Status
                // Find the original WITHDRAWAL_REQUEST transaction linked to this request
                // We stored request.id in referenceId
                await tx.userWalletTransaction.updateMany({
                    where: { referenceId: request.id, type: UserWalletTransactionType.WITHDRAWAL_REQUEST },
                    data: {
                        status: UserWalletTransactionStatus.COMPLETED,
                        description: `Withdrawal processed. Ref: ${validatedData.transactionId}`,
                        metadata: {
                            ...requestData.bankDetails as object, // preserve existing metadata if any, or just add bank details
                            transactionId: validatedData.transactionId,
                            adminNote: validatedData.adminNote
                        },
                        updatedAt: new Date()
                    }
                });

                // Log a specific PROCESSED transaction? 
                // The original request transaction was negative amount. COMPLETED means money is gone. This is correct.
                // We don't need another transaction unless we want to separate "Request" from "Payout".
                // Current flow: Request (Pending, -Amount) -> Approved (Completed, -Amount). Correct.

            } else {
                // REJECT

                // Update Request Status
                await tx.withdrawalRequest.update({
                    where: { id: request.id },
                    data: {
                        status: WithdrawalStatus.REJECTED,
                        processedBy: adminId,
                        processedAt: new Date(),
                        adminNote: validatedData.adminNote || 'Rejected by admin'
                    }
                });

                // Refund User Wallet
                const user = await tx.user.findUnique({ where: { id: request.userId } });

                await tx.user.update({
                    where: { id: request.userId },
                    data: {
                        walletBalance: { increment: request.amount }
                    }
                });

                // Update Original Transaction to FAILED or REFUNDED?
                await tx.userWalletTransaction.updateMany({
                    where: { referenceId: request.id, type: UserWalletTransactionType.WITHDRAWAL_REQUEST },
                    data: {
                        status: UserWalletTransactionStatus.FAILED,
                        description: `Withdrawal rejected: ${validatedData.adminNote}`,
                        updatedAt: new Date()
                    }
                });

                // Log Refund Transaction
                await tx.userWalletTransaction.create({
                    data: {
                        userId: request.userId,
                        type: UserWalletTransactionType.WITHDRAWAL_REJECTED, // Using specific Enum
                        amount: request.amount, // Positive (Refund)
                        currency: request.currency,
                        status: UserWalletTransactionStatus.COMPLETED,
                        source: 'SYSTEM',
                        referenceId: request.id,
                        description: `Refund for rejected withdrawal`,
                        previousBalance: Number(user?.walletBalance || 0),
                        newBalance: Number(user?.walletBalance || 0) + request.amount,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                });
            }

            // Return updated request
            const updatedRequestData = await tx.withdrawalRequest.findUniqueOrThrow({ where: { id: request.id } });
            // Map manual again
            return this.withdrawalMapper.toResponseDTO(new WithdrawalRequest({
                id: updatedRequestData.id,
                userId: updatedRequestData.userId,
                amount: Number(updatedRequestData.amount),
                currency: updatedRequestData.currency,
                status: updatedRequestData.status as WithdrawalStatus,
                bankDetails: updatedRequestData.bankDetails as Record<string, any>,
                adminNote: updatedRequestData.adminNote,
                processedBy: updatedRequestData.processedBy,
                processedAt: updatedRequestData.processedAt,
                transactionId: updatedRequestData.transactionId,
                createdAt: updatedRequestData.createdAt,
                updatedAt: updatedRequestData.updatedAt
            }));
        });
    }
}
