import { z } from 'zod';
export declare const GetCreditTransactionsRequestSchema: z.ZodObject<{
    userId: z.ZodString;
    type: z.ZodOptional<z.ZodEnum<{
        PROJECT_EARNING: "PROJECT_EARNING";
        SESSION_EARNING: "SESSION_EARNING";
        SESSION_PAYMENT: "SESSION_PAYMENT";
        CREDIT_PURCHASE: "CREDIT_PURCHASE";
    }>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type GetCreditTransactionsRequestDTO = z.infer<typeof GetCreditTransactionsRequestSchema>;
export declare const CreditTransactionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    amount: z.ZodNumber;
    credits: z.ZodOptional<z.ZodNumber>;
    description: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
        PENDING: "PENDING";
        COMPLETED: "COMPLETED";
        FAILED: "FAILED";
    }>;
    createdAt: z.ZodString;
    metadata: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>;
export type CreditTransactionDTO = z.infer<typeof CreditTransactionSchema>;
export declare const GetCreditTransactionsResponseSchema: z.ZodObject<{
    transactions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        amount: z.ZodNumber;
        credits: z.ZodOptional<z.ZodNumber>;
        description: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
            PENDING: "PENDING";
            COMPLETED: "COMPLETED";
            FAILED: "FAILED";
        }>;
        createdAt: z.ZodString;
        metadata: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodAny>>;
    }, z.core.$strip>>;
    pagination: z.ZodObject<{
        total: z.ZodNumber;
        page: z.ZodNumber;
        limit: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, z.core.$strip>;
    stats: z.ZodObject<{
        totalEarned: z.ZodNumber;
        totalSpent: z.ZodNumber;
        totalPurchased: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type GetCreditTransactionsResponseDTO = z.infer<typeof GetCreditTransactionsResponseSchema>;
//# sourceMappingURL=GetCreditTransactionsDTO.d.ts.map