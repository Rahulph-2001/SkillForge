import { z } from 'zod';
import { WithdrawalStatus } from '../../../domain/entities/WithdrawalRequest';

// --- System Settings ---

export const SetRedemptionSettingsSchema = z.object({
    rate: z.number().positive('Rate must be positive').describe('Value of 1 credit in currency'),
    minCredits: z.number().int().min(1, 'Minimum credits must be at least 1').optional(),
    maxCredits: z.number().int().min(1, 'Maximum credits must be at least 1').optional(),
});

export type SetRedemptionSettingsDTO = z.infer<typeof SetRedemptionSettingsSchema>;

// --- Wallet ---

export const RedeemCreditsSchema = z.object({
    creditsToRedeem: z.number().int().positive('Credits must be a positive integer'),
});

export type RedeemCreditsDTO = z.infer<typeof RedeemCreditsSchema>;

export const RequestWithdrawalSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().length(3).optional().default('INR'),
    bankDetails: z.object({
        accountNumber: z.string().min(5),
        ifscCode: z.string().min(4),
        accountHolderName: z.string().min(2),
        bankName: z.string().min(2),
        upiId: z.string().optional(),
    }).describe('Bank details snapshot for this specific request'),
});

export type RequestWithdrawalDTO = z.infer<typeof RequestWithdrawalSchema>;

// --- Admin Withdrawal Management ---

export const ProcessWithdrawalSchema = z.object({
    withdrawalId: z.string().uuid(),
    action: z.enum(['APPROVE', 'REJECT']),
    transactionId: z.string().optional().describe('Bank transaction reference ID, required for approval'),
    adminNote: z.string().optional(),
});

export type ProcessWithdrawalDTO = z.infer<typeof ProcessWithdrawalSchema>;

// --- Responses ---

export interface RedemptionSettingsResponseDTO {
    rate: number;
    minCredits: number;
    maxCredits: number;
}

export interface WalletInfoResponseDTO {
    credits: {
        total: number;
        earned: number;
        purchased: number;
        redeemable: number;
    };
    walletBalance: number;
    conversionRate: number;
    minRedemptionCredits: number;
    maxRedemptionCredits: number;
    estimatedRedemptionValue: number;
    verification: {
        email_verified: boolean;
        bank_details: {
            account_number: string | null;
            ifsc_code: string | null;
            bank_name: string | null;
            verified: boolean;
        };
    };
}
