import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient, Prisma } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { Booking, BookingStatus, RescheduleInfo } from '../../../domain/entities/Booking';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { NotFoundError, ValidationError, ConflictError } from '../../../domain/errors/AppError';

@injectable()
export class BookingRepository extends BaseRepository<Booking> implements IBookingRepository {
  constructor(@inject(TYPES.Database) db: Database) {
    super(db, 'booking');
  }

  // --- Helper: Mapper ---
  private mapToDomain(data: any): Booking {
    let rescheduleInfo: RescheduleInfo | null = null;

    // Handle Prisma JSON type safely
    if (data.rescheduleInfo && typeof data.rescheduleInfo === 'object') {
      const info = data.rescheduleInfo as any;
      rescheduleInfo = {
        ...info,
        requestedAt: info.requestedAt ? new Date(info.requestedAt) : new Date(),
      };
    }

    return Booking.create({
      id: data.id,
      skillId: data.skillId,
      skillTitle: data.skill?.title,
      providerId: data.providerId,
      providerName: data.provider?.name,
      providerAvatar: data.provider?.avatarUrl,
      learnerId: data.learnerId,
      learnerName: data.learner?.name,
      learnerAvatar: data.learner?.avatarUrl,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      duration: data.skill?.durationHours ? data.skill.durationHours * 60 : undefined,
      message: data.message,
      notes: data.notes,
      status: data.status as BookingStatus,
      sessionCost: data.sessionCost,
      rescheduleInfo,
      rejectionReason: data.rejectionReason,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      startAt: data.startAt,
      endAt: data.endAt,
      isReviewed: !!data.review,
    });
  }

  // --- Read Operations ---

  async findById(bookingId: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
    });

    return booking ? this.mapToDomain(booking) : null;
  }

  async findByProviderId(providerId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { providerId, isDeleted: false },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => this.mapToDomain(b));
  }

  async findByLearnerId(learnerId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        learnerId,
        isDeleted: false,
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => this.mapToDomain(b));
  }

  async findDuplicateBooking(
    learnerId: string,
    skillId: string,
    preferredDate: string,
    preferredTime: string
  ): Promise<Booking | null> {
    // Convert date string to Date object at start of day for Prisma
    const dateObj = new Date(preferredDate);
    dateObj.setHours(0, 0, 0, 0);

    // Use date range to match the entire day
    const startOfDay = dateObj.toISOString();
    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);

    const booking = await this.prisma.booking.findFirst({
      where: {
        learnerId,
        skillId,
        preferredDate: {
          gte: startOfDay,
          lte: endOfDay.toISOString(),
        },
        preferredTime,
        status: { in: ['pending', 'confirmed'] },
        isDeleted: false,
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
    });

    return booking ? this.mapToDomain(booking) : null;
  }

  // --- Standard CRUD ---

  async create(booking: Booking): Promise<Booking> {
    const domainBooking = booking.toObject();
    // Convert preferredDate string to Date object for Prisma
    const preferredDateObj = new Date(domainBooking.preferredDate);

    const created = await this.prisma.booking.create({
      data: {
        id: domainBooking.id,
        skillId: domainBooking.skillId,
        providerId: domainBooking.providerId,
        learnerId: domainBooking.learnerId,
        preferredDate: preferredDateObj,
        preferredTime: domainBooking.preferredTime,
        startAt: domainBooking.startAt,
        endAt: domainBooking.endAt,
        message: domainBooking.message,
        status: domainBooking.status,
        sessionCost: domainBooking.sessionCost,
        rescheduleInfo: domainBooking.rescheduleInfo as any,
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
    });
    return this.mapToDomain(created);
  }

  // --- Transactional Writes (Industrial Level) ---

  async createWithEscrow(booking: Booking, sessionCost: number): Promise<Booking> {
    const domainBooking = booking.toObject();

    return await (this.prisma as PrismaClient).$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Lock & Check Learner Balance
      const learner = await tx.user.findUnique({
        where: { id: domainBooking.learnerId }
      });

      if (!learner) throw new NotFoundError('Learner Not Found');
      if (learner.credits < sessionCost) {
        throw new ValidationError('Insufficient credits to complete this booking');
      }

      // 2. Double-check for overlap (Optimistic Concurrency Control)
      const startAt = domainBooking.startAt;
      const endAt = domainBooking.endAt;

      if (!startAt || !endAt) {
        throw new ValidationError("Booking missing start/end time");
      }

      const existingCount = await tx.booking.count({
        where: {
          providerId: domainBooking.providerId,
          status: { in: ['pending', 'confirmed', 'reschedule_requested'] },
          isDeleted: false,
          AND: [
            { startAt: { lt: endAt } },
            { endAt: { gt: startAt } }
          ] as any
        }
      });

      if (existingCount > 0) {
        throw new ConflictError('Slot was just taken by another user');
      }

      // 3. Hold Credits in Escrow (Move from available to held)
      const updatedLearner = await tx.user.update({
        where: { id: domainBooking.learnerId },
        data: {
          credits: { decrement: sessionCost },
          heldCredits: { increment: sessionCost }
        }
      });

      // Convert preferredDate string to Date object for Prisma
      const preferredDateObj = new Date(domainBooking.preferredDate);

      // 4. Create Booking
      const created = await tx.booking.create({
        data: {
          id: domainBooking.id,
          skillId: domainBooking.skillId,
          providerId: domainBooking.providerId,
          learnerId: domainBooking.learnerId,
          preferredDate: preferredDateObj,
          preferredTime: domainBooking.preferredTime,
          startAt: startAt,
          endAt: endAt,
          message: domainBooking.message,
          status: domainBooking.status,
          sessionCost: sessionCost,
          rescheduleInfo: domainBooking.rescheduleInfo as any,
        },
        include: {
          skill: { select: { title: true, durationHours: true } },
          provider: { select: { name: true, avatarUrl: true } },
          learner: { select: { name: true, avatarUrl: true } },
          review: { select: { id: true } },
        },
      });

      // 4b. Log Wallet Transaction (SESSION_PAYMENT)
      // @ts-ignore
      await tx.userWalletTransaction.create({
        data: {
          userId: domainBooking.learnerId,
          type: 'SESSION_PAYMENT',
          amount: sessionCost,
          currency: 'INR',
          source: 'SESSION_BOOKING',
          referenceId: created.id,
          description: `Booking for ${domainBooking.skillTitle || 'Session'}`,
          previousBalance: new Prisma.Decimal(Number(updatedLearner.credits) + sessionCost),
          newBalance: new Prisma.Decimal(updatedLearner.credits),
          status: 'COMPLETED',
        },
      });

      // 5. Create Escrow Transaction Record
      await tx.escrowTransaction.create({
        data: {
          bookingId: created.id,
          learnerId: domainBooking.learnerId,
          providerId: domainBooking.providerId,
          amount: sessionCost,
          status: 'HELD',
          heldAt: new Date(),
        }
      });

      return this.mapToDomain(created);
    });
  }





  async acceptBooking(bookingId: string): Promise<Booking> {
    // This method is non-transactional - use confirmTransactional for credit handling
    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'confirmed', updatedAt: new Date() },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
    });

    return this.mapToDomain(booking);
  }

  async declineBooking(bookingId: string, reason: string): Promise<Booking> {
    return await (this.prisma as PrismaClient).$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Fetch booking
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          skill: { select: { title: true, durationHours: true } },
          provider: { select: { name: true, avatarUrl: true } },
          learner: { select: { name: true, avatarUrl: true } },
        },
      });

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      // 2. Refund credits to learner (if booking was pending or confirmed)
      if (booking.status === 'pending' || booking.status === 'confirmed') {
        await tx.user.update({
          where: { id: booking.learnerId },
          data: { credits: { increment: booking.sessionCost } }
        });

        // If booking was confirmed, also deduct from provider (reverse the credit)
        if (booking.status === 'confirmed') {
          await tx.user.update({
            where: { id: booking.providerId },
            data: { credits: { decrement: booking.sessionCost } }
          });
        }
      }

      // 3. Update booking status to rejected
      const declined = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'rejected' as BookingStatus,
          rejectionReason: reason,
          updatedAt: new Date(),
        },
        include: {
          skill: { select: { title: true, durationHours: true } },
          provider: { select: { name: true, avatarUrl: true } },
          learner: { select: { name: true, avatarUrl: true } },
        },
      });

      return this.mapToDomain(declined);
    });
  }

  async rescheduleBooking(bookingId: string, rescheduleInfo: RescheduleInfo): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'reschedule_requested',
        rescheduleInfo: rescheduleInfo as any,
        updatedAt: new Date(),
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
    });

    return this.mapToDomain(updated);
  }


  async delete(id: string): Promise<void> {
    await super.delete(id);
  }

  async findByProviderIdAndStatus(providerId: string, status: BookingStatus): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { providerId, status: status as any, isDeleted: false },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map((b) => this.mapToDomain(b));
  }

  async findByLearnerIdAndStatus(learnerId: string, status: BookingStatus): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { learnerId, status: status as any, isDeleted: false },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return bookings.map((b) => this.mapToDomain(b));
  }

  async findOverlapping(providerId: string, date: Date, startTime: string, endTime: string): Promise<Booking[]> {
    // Convert date to start and end of day for Prisma
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dateString = date.toISOString().split('T')[0];
    const bookings = await this.prisma.booking.findMany({
      where: {
        providerId,
        preferredDate: {
          gte: startOfDay.toISOString(),
          lte: endOfDay.toISOString(),
        },
        status: { in: ['pending', 'confirmed'] },
        isDeleted: false,
        OR: [
          {
            preferredTime: { gte: startTime, lt: endTime },
          },
          {
            preferredTime: { lte: startTime },
            endAt: { gt: new Date(`${dateString}T${startTime}`) },
          },
        ],
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
    });
    return bookings.map((b) => this.mapToDomain(b));
  }

  async findInDateRange(providerId: string, startDate: Date, endDate: Date): Promise<Booking[]> {
    // Set startDate to beginning of day (00:00:00)
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Set endDate to end of day (23:59:59.999)
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await this.prisma.booking.findMany({
      where: {
        providerId,
        preferredDate: {
          gte: startOfDay.toISOString(),
          lte: endOfDay.toISOString(),
        },
        isDeleted: false,
        // Exclude rejected, cancelled, and completed bookings from schedule
        status: {
          notIn: ['rejected', 'cancelled', 'completed']
        }
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
      orderBy: { preferredDate: 'asc' },
    });
    return bookings.map((b) => this.mapToDomain(b));
  }

  async findOverlappingWithBuffer(
    providerId: string,
    date: Date,
    startTime: string,
    endTime: string,
    bufferMinutes: number
  ): Promise<Booking[]> {
    // Convert date to start and end of day for Prisma
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dateString = date.toISOString().split('T')[0];
    const bufferMs = bufferMinutes * 60 * 1000;
    const startDateTime = new Date(`${dateString}T${startTime}`);
    const endDateTime = new Date(`${dateString}T${endTime}`);
    const bufferedStart = new Date(startDateTime.getTime() - bufferMs);
    const bufferedEnd = new Date(endDateTime.getTime() + bufferMs);

    const bookings = await this.prisma.booking.findMany({
      where: {
        providerId,
        preferredDate: {
          gte: startOfDay.toISOString(),
          lte: endOfDay.toISOString(),
        },
        // Include reschedule_requested since those bookings still occupy their old slots
        status: { in: ['pending', 'confirmed', 'reschedule_requested'] },
        isDeleted: false,
        AND: [
          { startAt: { lt: bufferedEnd } },
          { endAt: { gt: bufferedStart } },
        ],
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
    });
    return bookings.map((b) => this.mapToDomain(b));
  }

  async countActiveBookingsByProviderAndDate(providerId: string, dateString: string): Promise<number> {
    // Convert date string to Date object at start of day for Prisma
    const dateObj = new Date(dateString);
    dateObj.setHours(0, 0, 0, 0);

    // Use date range to match the entire day
    const startOfDay = dateObj.toISOString();
    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.prisma.booking.count({
      where: {
        providerId,
        preferredDate: {
          gte: startOfDay,
          lte: endOfDay.toISOString(),
        },
        // Include reschedule_requested since those bookings still occupy their slots
        status: { in: ['pending', 'confirmed', 'reschedule_requested'] },
        isDeleted: false,
      },
    });
  }



  async updateStatus(bookingId: string, status: BookingStatus, reason?: string): Promise<Booking> {
    return await (this.prisma as PrismaClient).$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Fetch current booking state
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          skill: { select: { title: true, durationHours: true } },
          provider: { select: { name: true, avatarUrl: true } },
          learner: { select: { name: true, avatarUrl: true } },
        },
      });

      if (!booking) {
        throw new NotFoundError('Booking not found');
      }

      const previousStatus = booking.status as BookingStatus;


      // 2. (Refactored) Credit refunds are now handled by specific Use Cases via EscrowRepository
      // This ensures Single Responsibility and prevents double-refunds.


      // 3. Update booking status with appropriate reason field
      const updateData: any = {
        status: status as any,
        updatedAt: new Date(),
      };

      // Set the correct reason field based on status
      if (status === BookingStatus.REJECTED) {
        updateData.rejectionReason = reason;
      } else if (status === BookingStatus.CANCELLED) {
        updateData.cancelledReason = reason;
      }

      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: updateData,
        include: {
          skill: { select: { title: true, durationHours: true } },
          provider: { select: { name: true, avatarUrl: true } },
          learner: { select: { name: true, avatarUrl: true } },
        },
      });

      return this.mapToDomain(updated);
    });
  }

  async updateWithReschedule(bookingId: string, rescheduleInfo: any): Promise<Booking> {
    return await this.rescheduleBooking(bookingId, rescheduleInfo);
  }

  async acceptReschedule(bookingId: string, newDate: string, newTime: string): Promise<Booking> {
    return await (this.prisma as PrismaClient).$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Fetch booking with reschedule info
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          skill: { select: { title: true, durationHours: true } },
          provider: { select: { name: true, avatarUrl: true } },
          learner: { select: { name: true, avatarUrl: true } },
        },
      });

      if (!booking || !booking.rescheduleInfo) {
        throw new NotFoundError('Booking or reschedule info not found');
      }

      const rescheduleInfo = booking.rescheduleInfo as any;

      // 2. Calculate new start/end times (use provided or calculate from skill duration)
      let newStartAt: Date;
      let newEndAt: Date;

      if (rescheduleInfo.newStartAt && rescheduleInfo.newEndAt) {
        newStartAt = new Date(rescheduleInfo.newStartAt);
        newEndAt = new Date(rescheduleInfo.newEndAt);
      } else {
        // Calculate from newDate, newTime, and skill duration
        const [startHours, startMinutes] = newTime.split(':').map(Number);
        newStartAt = new Date(newDate);
        newStartAt.setHours(startHours, startMinutes, 0, 0);

        const durationHours = booking.skill?.durationHours || 1; // Default to 1 hour if not found
        newEndAt = new Date(newStartAt);
        newEndAt.setHours(newEndAt.getHours() + durationHours);
      }

      // 3. Validate new slot doesn't conflict with existing bookings
      // Include reschedule_requested status to prevent conflicts with other reschedule requests
      const conflictingBooking = await tx.booking.findFirst({
        where: {
          providerId: booking.providerId,
          id: { not: bookingId }, // Exclude current booking
          status: { in: ['pending', 'confirmed', 'reschedule_requested'] },
          isDeleted: false,
          AND: [
            { startAt: { lt: newEndAt } },
            { endAt: { gt: newStartAt } }
          ] as any
        }
      });

      if (conflictingBooking) {
        throw new ConflictError('New time slot conflicts with an existing booking');
      }

      // 4. Convert preferredDate string to Date object for Prisma
      const preferredDateObj = new Date(newDate);

      // 5. Update booking with new date/time and clear reschedule info
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'confirmed',
          preferredDate: preferredDateObj,
          preferredTime: newTime,
          startAt: newStartAt,
          endAt: newEndAt,
          rescheduleInfo: Prisma.JsonNull,
          updatedAt: new Date(),
        },
        include: {
          skill: { select: { title: true, durationHours: true } },
          provider: { select: { name: true, avatarUrl: true } },
          learner: { select: { name: true, avatarUrl: true } },
        },
      });

      return this.mapToDomain(updated);
    });
  }

  async declineReschedule(bookingId: string, _reason: string): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'confirmed',
        rescheduleInfo: Prisma.JsonNull,
        updatedAt: new Date(),
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
        review: { select: { id: true } },
      },
    });

    return this.mapToDomain(updated);
  }

  async getProviderStats(providerId: string): Promise<{
    pending: number;
    confirmed: number;
    reschedule: number;
    completed: number;
    cancelled: number;
  }> {
    const [pending, confirmed, reschedule, completed, cancelled] = await Promise.all([
      this.prisma.booking.count({ where: { providerId, status: 'pending', isDeleted: false } }),
      this.prisma.booking.count({ where: { providerId, status: 'confirmed', isDeleted: false } }),
      this.prisma.booking.count({ where: { providerId, status: 'reschedule_requested', isDeleted: false } }),
      this.prisma.booking.count({ where: { providerId, status: 'completed', isDeleted: false } }),
      this.prisma.booking.count({ where: { providerId, status: 'cancelled', isDeleted: false } }),
    ]);

    return { pending, confirmed, reschedule, completed, cancelled };
  }

  // --- Admin Operations ---

  async listAll(page: number, limit: number, search?: string): Promise<{ data: Booking[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { skill: { title: { contains: search, mode: 'insensitive' } } },
        { provider: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          skill: { select: { title: true, durationHours: true } },
          provider: { select: { name: true, avatarUrl: true } },
          learner: { select: { name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings.map((b) => this.mapToDomain(b)),
      total,
    };
  }

  async getGlobalStats(): Promise<{
    totalSessions: number;
    completed: number;
    upcoming: number;
    cancelled: number;
  }> {
    const [totalSessions, completed, upcoming, cancelled] = await Promise.all([
      this.prisma.booking.count({ where: { isDeleted: false } }),
      this.prisma.booking.count({ where: { status: 'completed', isDeleted: false } }),
      this.prisma.booking.count({ where: { status: { in: ['pending', 'confirmed'] }, isDeleted: false } }),
      this.prisma.booking.count({ where: { status: 'cancelled', isDeleted: false } }),
    ]);

    return { totalSessions, completed, upcoming, cancelled };
  }

}