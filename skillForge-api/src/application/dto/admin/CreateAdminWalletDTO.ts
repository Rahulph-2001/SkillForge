import {z} from 'zod'

export const CreateAdminWalletRequestSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().length(3,'Currency must be 3 charcters'),
    source: z.string().min(1,'Source is required'),
    description: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
})

export type CreateAdminWalletRequestDTO = z.infer<typeof CreateAdminWalletRequestSchema>