import { z } from 'zod';
import { UserWalletTransactionType, UserWalletTransactionStatus } from '../../../domain/entities/UserWalletTransaction';
export declare const GetUserWalletTransactionsRequestSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<typeof UserWalletTransactionType>>;
    status: z.ZodOptional<z.ZodEnum<typeof UserWalletTransactionStatus>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type GetUserWalletTransactionsRequestDTO = z.infer<typeof GetUserWalletTransactionsRequestSchema>;
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
export interface GetUserWalletTransactionsResponseDTO {
    transactions: UserWalletTransactionDTO[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
//# sourceMappingURL=UserWalletTransactionDTO.d.ts.map