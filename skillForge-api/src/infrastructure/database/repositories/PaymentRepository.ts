import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { Payment } from '../../../domain/entities/Payment';
import { PaymentStatus, PaymentPurpose } from '../../../domain/enums/PaymentEnums';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';

@injectable()
export class PrismaPaymentRepository extends BaseRepository<Payment> implements IPaymentRepository {
    constructor(@inject(TYPES.Database) db: Database) {
        super(db, 'payment');
    }

    async create(payment: Payment): Promise<Payment> {
        const data = await this.prisma.payment.create({
            data: {
                id: payment.id,
                user_id: payment.userId,
                provider: payment.provider,
                provider_payment_id: payment.providerPaymentId,
                provider_customer_id: payment.providerCustomerId,
                amount: payment.amount,
                currency: payment.currency,
                purpose: payment.purpose,
                status: payment.status,
                metadata: payment.metadata as any,
                failure_reason: payment.failureReason,
                refunded_amount: payment.refundedAmount,
                created_at: payment.createdAt,
                updated_at: payment.updatedAt,
            },
        });
        return Payment.fromJSON(data);
    }

    async findById(id: string): Promise<Payment | null> {
        const data = await this.prisma.payment.findUnique({ where: { id } });
        return data ? Payment.fromJSON(data) : null;
    }

    async findByProviderPaymentId(providerPaymentId: string): Promise<Payment | null> {
        const data = await this.prisma.payment.findFirst({
            where: { provider_payment_id: providerPaymentId },
        });
        return data ? Payment.fromJSON(data) : null;
    }

    async findByUserId(userId: string, page: number, limit: number): Promise<{ payments: Payment[]; total: number }> {
        const [data, total] = await Promise.all([
            this.prisma.payment.findMany({
                where: { user_id: userId },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.payment.count({ where: { user_id: userId } }),
        ]);
        return {
            payments: data.map(Payment.fromJSON),
            total,
        };
    }

    async findByUserIdAndPurpose(userId: string, purpose: PaymentPurpose): Promise<Payment[]> {
        const data = await this.prisma.payment.findMany({
            where: { user_id: userId, purpose },
            orderBy: { created_at: 'desc' },
        });
        return data.map(Payment.fromJSON);
    }

    async update(payment: Payment): Promise<Payment> {
        const data = await this.prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: payment.status,
                provider_payment_id: payment.providerPaymentId,
                failure_reason: payment.failureReason,
                refunded_amount: payment.refundedAmount,
                updated_at: payment.updatedAt,
            },
        });
        return Payment.fromJSON(data);
    }

    async updateStatus(id: string, status: PaymentStatus): Promise<void> {
        await this.prisma.payment.update({
            where: { id },
            data: { status, updated_at: new Date() },
        });
    }
}