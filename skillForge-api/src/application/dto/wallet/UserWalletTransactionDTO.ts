import { z } from 'zod';
import { UserWalletTransactionType, UserWalletTransactionStatus } from '../../../domain/entities/UserWalletTransaction';

// Request DTO for getting transactions
export const GetUserWalletTransactionsRequestSchema = z.object({
    type: z.nativeEnum(UserWalletTransactionType).optional(),
    status: z.nativeEnum(UserWalletTransactionStatus).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetUserWalletTransactionsRequestDTO = z.infer<typeof GetUserWalletTransactionsRequestSchema>;

// Response DTO for a single transaction
export interface UserWalletTransactionDTO {
    id: string;
    userId: string;
    type: UserWalletTransactionType;
    amount: number;
    currency: string;
    source: string;
    referenceId?: string | null;
    description?: string | null;
    metadata?: Record<string, any> | null;
    previousBalance: number;
    newBalance: number;
    status: UserWalletTransactionStatus;
    createdAt: string;
}

// Response DTO for wallet overview
export interface UserWalletDataDTO {
    walletBalance: number;
    credits: {
        total: number;
        earned: number;
        purchased: number;
        bonus: number;
        redeemable: number;
    };
    verification: {
        email_verified: boolean;
        bank_verified: boolean;
    };
}

// Paginated transactions response
export interface GetUserWalletTransactionsResponseDTO {
    transactions: UserWalletTransactionDTO[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
