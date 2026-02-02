import { z } from 'zod';
export declare const WalletTransactionSchema: z.ZodObject<{
    id: z.ZodString;
    transactionId: z.ZodString;
    userId: z.ZodString;
    userName: z.ZodString;
    userEmail: z.ZodString;
    type: z.ZodEnum<{
        WITHDRAWAL: "WITHDRAWAL";
        CREDIT: "CREDIT";
        DEBIT: "DEBIT";
    }>;
    amount: z.ZodNumber;
    description: z.ZodString;
    date: z.ZodDate;
    status: z.ZodEnum<{
        PENDING: "PENDING";
        COMPLETED: "COMPLETED";
        FAILED: "FAILED";
    }>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>;
export declare const GetWalletTransactionsResponseSchema: z.ZodObject<{
    transactions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        transactionId: z.ZodString;
        userId: z.ZodString;
        userName: z.ZodString;
        userEmail: z.ZodString;
        type: z.ZodEnum<{
            WITHDRAWAL: "WITHDRAWAL";
            CREDIT: "CREDIT";
            DEBIT: "DEBIT";
        }>;
        amount: z.ZodNumber;
        description: z.ZodString;
        date: z.ZodDate;
        status: z.ZodEnum<{
            PENDING: "PENDING";
            COMPLETED: "COMPLETED";
            FAILED: "FAILED";
        }>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodNumber;
}, z.core.$strip>;
export type WalletTransactionDTO = z.infer<typeof WalletTransactionSchema>;
export type GetWalletTransactionsResponseDTO = z.infer<typeof GetWalletTransactionsResponseSchema>;
//# sourceMappingURL=GetWalletTransactionsDTO.d.ts.map