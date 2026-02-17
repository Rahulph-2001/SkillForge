import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { EscrowTransaction, EscrowStatus } from '../../../domain/entities/EscrowTransaction';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { NotFoundError, ValidationError } from '../../../domain/errors/AppError';
import { PrismaClient, Prisma } from '@prisma/client';

@injectable()
export class EscrowRepository extends BaseRepository<EscrowTransaction> implements IEscrowRepository {
  constructor(@inject(TYPES.Database) db: Database) {
    super(db, 'escrowTransaction');
  }

  private mapToDomain(data: any): EscrowTransaction {
    return EscrowTransaction.fromDatabaseRow(data);
  }

  async findByBookingId(bookingId: string): Promise<EscrowTransaction | null> {
    const escrow = await this.prisma.escrowTransaction.findUnique({
      where: { bookingId },
    });

    return escrow ? this.mapToDomain(escrow) : null;
  }

  async findByLearnerId(learnerId: string): Promise<EscrowTransaction[]> {
    const escrows = await this.prisma.escrowTransaction.findMany({
      where: { learnerId },
      orderBy: { createdAt: 'desc' },
    });

    return escrows.map((e: any) => this.mapToDomain(e));
  }

  async findByProviderId(providerId: string): Promise<EscrowTransaction[]> {
    const escrows = await this.prisma.escrowTransaction.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
    });

    return escrows.map((e: any) => this.mapToDomain(e));
  }

  async holdCredits(
    bookingId: string,
    learnerId: string,
    providerId: string,
    amount: number
  ): Promise<EscrowTransaction> {
    return await (this.prisma as PrismaClient).$transaction(async (tx: Prisma.TransactionClient) => {
      const learner = await tx.user.findUnique({
        where: { id: learnerId },
      });

      if (!learner) {
        throw new NotFoundError('Learner not found');
      }

      if (learner.credits < amount) {
        throw new ValidationError(
          `Insufficient credits. Required: ${amount}, Available: ${learner.credits}`
        );
      }

      await tx.user.update({
        where: { id: learnerId },
        data: {
          credits: { decrement: amount },
          heldCredits: { increment: amount },
        },
      });

      const escrow = await tx.escrowTransaction.create({
        data: {
          bookingId,
          learnerId,
          providerId,
          amount,
          status: 'HELD',
          heldAt: new Date(),
        },
      });

      return this.mapToDomain(escrow);
    });
  }

  async releaseCredits(bookingId: string): Promise<EscrowTransaction> {
    return await (this.prisma as PrismaClient).$transaction(async (tx: Prisma.TransactionClient) => {
      const escrow = await tx.escrowTransaction.findUnique({
        where: { bookingId },
      });

      if (!escrow) {
        throw new NotFoundError('Escrow transaction not found');
      }

      if (escrow.status !== 'HELD') {
        throw new ValidationError(
          `Cannot release escrow with status: ${escrow.status}`
        );
      }

      await tx.user.update({
        where: { id: escrow.learnerId },
        data: {
          heldCredits: { decrement: escrow.amount },
        },
      });

      const updatedProvider = await tx.user.update({
        where: { id: escrow.providerId },
        data: {
          credits: { increment: escrow.amount },
          earnedCredits: { increment: escrow.amount },
        },
      });

      // Log Transaction for Provider
      // @ts-ignore
      await tx.userWalletTransaction.create({
        data: {
          userId: escrow.providerId,
          type: 'SESSION_EARNING',
          amount: escrow.amount,
          currency: 'INR',
          source: 'SESSION_COMPLETION',
          referenceId: bookingId,
          description: `Earnings from completed session`,
          previousBalance: new Prisma.Decimal(Number(updatedProvider.credits) - escrow.amount),
          newBalance: new Prisma.Decimal(updatedProvider.credits),
          status: 'COMPLETED',
        },
      });

      const updated = await tx.escrowTransaction.update({
        where: { bookingId },
        data: {
          status: 'RELEASED',
          releasedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return this.mapToDomain(updated);
    });
  }

  async refundCredits(bookingId: string): Promise<EscrowTransaction> {
    return await (this.prisma as PrismaClient).$transaction(async (tx: Prisma.TransactionClient) => {
      const escrow = await tx.escrowTransaction.findUnique({
        where: { bookingId },
      });

      if (!escrow) {
        throw new NotFoundError('Escrow transaction not found');
      }

      if (escrow.status !== 'HELD') {
        throw new ValidationError(
          `Cannot refund escrow with status: ${escrow.status}`
        );
      }

      const updatedLearner = await tx.user.update({
        where: { id: escrow.learnerId },
        data: {
          credits: { increment: escrow.amount },
          heldCredits: { decrement: escrow.amount },
        },
      });

      // Log Transaction for Learner (Refund)
      // @ts-ignore
      await tx.userWalletTransaction.create({
        data: {
          userId: escrow.learnerId,
          type: 'REFUND',
          amount: escrow.amount,
          currency: 'INR',
          source: 'SESSION_REFUND',
          referenceId: bookingId,
          description: `Refund for session booking`,
          previousBalance: new Prisma.Decimal(Number(updatedLearner.credits) - escrow.amount),
          newBalance: new Prisma.Decimal(updatedLearner.credits),
          status: 'COMPLETED',
        },
      });

      const updated = await tx.escrowTransaction.update({
        where: { bookingId },
        data: {
          status: 'REFUNDED',
          refundedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return this.mapToDomain(updated);
    });
  }

  async getEscrowStats(userId: string): Promise<{
    totalHeld: number;
    totalReleased: number;
    totalRefunded: number;
  }> {
    const [heldResult, releasedResult, refundedResult] = await Promise.all([
      this.prisma.escrowTransaction.aggregate({
        where: { learnerId: userId, status: 'HELD' },
        _sum: { amount: true },
      }),
      this.prisma.escrowTransaction.aggregate({
        where: { learnerId: userId, status: 'RELEASED' },
        _sum: { amount: true },
      }),
      this.prisma.escrowTransaction.aggregate({
        where: { learnerId: userId, status: 'REFUNDED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalHeld: heldResult._sum.amount || 0,
      totalReleased: releasedResult._sum.amount || 0,
      totalRefunded: refundedResult._sum.amount || 0,
    };
  }
}