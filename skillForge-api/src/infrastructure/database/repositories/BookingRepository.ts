import { TYPES } from '../../../infrastructure/di/types';
import { PrismaClient, Prisma } from '@prisma/client';
import { injectable, inject } from 'inversify';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { Booking, BookingStatus, RescheduleInfo } from '../../../domain/entities/Booking';
import { Database } from '../Database';
import { NotFoundError, ValidationError, ConflictError } from '../../../domain/errors/AppError';

@injectable()
export class BookingRepository implements IBookingRepository {
  private prisma: PrismaClient;

  constructor(@inject(TYPES.Database) db: Database) {
    this.prisma = db.getClient();
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
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => this.mapToDomain(b));
  }

  async findByProviderIdAndStatus(providerId: string, status: BookingStatus): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        providerId,
        status,
        isDeleted: false,
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => this.mapToDomain(b));
  }

  async findByLearnerIdAndStatus(learnerId: string, status: BookingStatus): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        learnerId,
        status,
        isDeleted: false,
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => this.mapToDomain(b));
  }

  // --- Availability Logic ---

  async findOverlapping(providerId: string, date: Date, startTime: string, endTime: string): Promise<Booking[]> {
    const targetDate = new Date(date);

    // Fetch all active bookings for the day
    const bookings = await this.prisma.booking.findMany({
      where: {
        providerId,
        preferredDate: targetDate,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        isDeleted: false,
      },
      include: {
        skill: { select: { durationHours: true } }
      }
    });

    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    // Filter in-memory because calculating end time based on skill duration 
    // is complex in raw Prisma without SQL modifications.
    return bookings.filter(b => {
      const existingStart = toMinutes(b.preferredTime);
      const duration = b.skill.durationHours * 60;
      const existingEnd = existingStart + duration;

      // Overlap formula: (StartA < EndB) && (EndA > StartB)
      return Math.max(newStart, existingStart) < Math.min(newEnd, existingEnd);
    }).map(b => this.mapToDomain(b));
  }

  async findInDateRange(providerId: string, startDate: Date, endDate: Date): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        providerId,
        preferredDate: {
          gte: startDate,
          lte: endDate,
        },
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        isDeleted: false,
      },
      include: {
        skill: { select: { title: true, durationHours: true } }
      }
    });
    return bookings.map((b) => this.mapToDomain(b));
  }

  // --- NEW PRODUCTION-LEVEL METHODS ---

  /**
   * Find overlapping bookings including buffer time
   */
  async findOverlappingWithBuffer(
    providerId: string,
    date: Date,
    startTime: string,
    endTime: string,
    bufferMinutes: number
  ): Promise<Booking[]> {
    const targetDate = new Date(date);

    const bookings = await this.prisma.booking.findMany({
      where: {
        providerId,
        preferredDate: targetDate,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        isDeleted: false,
      },
      include: {
        skill: { select: { durationHours: true } }
      }
    });

    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    // New slot with buffer
    const newStart = toMinutes(startTime) - bufferMinutes;
    const newEnd = toMinutes(endTime) + bufferMinutes;

    return bookings.filter(b => {
      const existingStart = toMinutes(b.preferredTime) - bufferMinutes;
      const duration = b.skill.durationHours * 60;
      const existingEnd = existingStart + duration + (bufferMinutes * 2);

      // Check for overlap
      return Math.max(newStart, existingStart) < Math.min(newEnd, existingEnd);
    }).map(b => this.mapToDomain(b));
  }

  /**
   * Count active bookings for a provider on a specific date
   */
  async countActiveBookingsByProviderAndDate(
    providerId: string,
    dateString: string
  ): Promise<number> {
    const date = new Date(dateString);

    return await this.prisma.booking.count({
      where: {
        providerId,
        preferredDate: date,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        isDeleted: false
      }
    });
  }

  /**
   * Find duplicate booking (idempotency check)
   */
  async findDuplicateBooking(
    learnerId: string,
    skillId: string,
    preferredDate: string,
    preferredTime: string
  ): Promise<Booking | null> {
    const date = new Date(preferredDate);

    const booking = await this.prisma.booking.findFirst({
      where: {
        learnerId,
        skillId,
        preferredDate: date,
        preferredTime,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        isDeleted: false
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } }
      }
    });

    return booking ? this.mapToDomain(booking) : null;
  }

  // --- Transactional Writes (Industrial Level) ---

  async createTransactional(booking: Booking, sessionCost: number): Promise<Booking> {
    const domainBooking = booking.toObject();

    return await this.prisma.$transaction(async (tx) => {
      // 1. Lock & Check Learner Balance
      const learner = await tx.user.findUnique({
        where: { id: domainBooking.learnerId }
      });

      if (!learner) throw new NotFoundError('Learner Not Found');
      if (learner.credits < sessionCost) {
        throw new ValidationError('Insufficient credits to complete this booking');
      }

      // 2. Double-check for overlap (Optimistic Concurrency Control)
      // Using Industrial Level Range Check (StartA < EndB) && (EndA > StartB)
      // We look for any booking that overlaps with our desired range

      const startAt = domainBooking.startAt;
      const endAt = domainBooking.endAt;

      if (!startAt || !endAt) {
        throw new ValidationError("Booking missing start/end time");
      }

      const existingCount = await tx.booking.count({
        where: {
          providerId: domainBooking.providerId,
          status: { in: ['pending', 'confirmed'] },
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

      // 3. Process Credits (Debit Learner Only)
      // Held in system until confirmation
      await tx.user.update({
        where: { id: domainBooking.learnerId },
        data: { credits: { decrement: sessionCost } }
      });

      // NOTE: Provider is NOT credited yet. This prevents fraud/loss if booking is rejected.

      // 4. Create Booking
      const createdBooking = await tx.booking.create({
        data: {
          skillId: domainBooking.skillId,
          providerId: domainBooking.providerId,
          learnerId: domainBooking.learnerId,
          preferredDate: new Date(domainBooking.preferredDate),
          preferredTime: domainBooking.preferredTime,
          message: domainBooking.message,
          status: domainBooking.status,
          sessionCost: domainBooking.sessionCost,
          startAt: domainBooking.startAt,
          endAt: domainBooking.endAt,
        } as any,
        include: {
          skill: { select: { title: true, durationHours: true } },
          provider: { select: { name: true, avatarUrl: true } },
          learner: { select: { name: true, avatarUrl: true } }
        }
      });

      return this.mapToDomain(createdBooking);
    });
  }

  async confirmTransactional(bookingId: string): Promise<Booking> {
    return await this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!booking) throw new NotFoundError("Booking not found");
      if (booking.status !== BookingStatus.PENDING) throw new ValidationError("Booking is not pending");

      // Credit Provider (Release Escrow)
      await tx.user.update({
        where: { id: booking.providerId },
        data: {
          credits: { increment: booking.sessionCost },
          earnedCredits: { increment: booking.sessionCost }
        }
      });

      // Update Status
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
          confirmedDate: new Date(),
          updatedAt: new Date()
        },
        include: {
          skill: { select: { title: true, durationHours: true } },
          provider: { select: { name: true, avatarUrl: true } },
          learner: { select: { name: true, avatarUrl: true } }
        }
      });

      return this.mapToDomain(updated);
    });
  }

  async cancelTransactional(bookingId: string, cancelledBy: string, reason: string): Promise<Booking> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Fetch existing booking
      const booking = await tx.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) throw new NotFoundError('Booking not found');

      // Check if already cancelled
      if (booking.status === 'cancelled' || booking.status === 'rejected') {
        throw new ConflictError('Booking is already cancelled or rejected');
      }

      // 2. Reverse Credits
      const cost = booking.sessionCost;

      // Refund Learner
      await tx.user.update({
        where: { id: booking.learnerId },
        data: { credits: { increment: cost } }
      });

      // Deduct from Provider ONLY if previously credited (Confirmed/Completed)
      if (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.COMPLETED) {
        await tx.user.update({
          where: { id: booking.providerId },
          data: {
            credits: { decrement: cost },
            earnedCredits: { decrement: cost }
          }
        });
      }

      // 3. Update Status
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledBy,
          cancelledReason: reason,
          updatedAt: new Date(),
        },
        include: {
          skill: { select: { title: true, durationHours: true } },
          provider: { select: { name: true, avatarUrl: true } },
          learner: { select: { name: true, avatarUrl: true } }
        },
      });

      return this.mapToDomain(updatedBooking);
    });
  }

  // --- Standard Write Operations ---

  async create(booking: Booking): Promise<Booking> {
    // Note: Use createTransactional for actual business logic. 
    // This exists as a fallback or for admin seeding.
    const created = await this.prisma.booking.create({
      data: {
        skillId: booking.skillId,
        providerId: booking.providerId,
        learnerId: booking.learnerId,
        preferredDate: new Date(booking.preferredDate),
        preferredTime: booking.preferredTime,
        message: booking.message,
        status: booking.status,
        sessionCost: booking.sessionCost,
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
      },
    });

    return this.mapToDomain(created);
  }

  async updateStatus(bookingId: string, status: BookingStatus, reason?: string): Promise<Booking> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Fetch Booking to get cost and learner
      const booking = await tx.booking.findUnique({ where: { id: bookingId } });
      if (!booking) throw new NotFoundError('Booking not found');

      // 2. Handle Rejection Refund (Escrow Release back to Learner)
      if (status === BookingStatus.REJECTED && booking.status === BookingStatus.PENDING) {
        await tx.user.update({
          where: { id: booking.learnerId },
          data: { credits: { increment: booking.sessionCost } }
        });
      }

      // 3. Update Status
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status,
          rejectionReason: status === BookingStatus.REJECTED ? reason : undefined,
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

  async updateWithReschedule(bookingId: string, rescheduleInfo: any): Promise<Booking> {
    const serializedInfo = {
      ...rescheduleInfo,
      requestedAt: rescheduleInfo.requestedAt instanceof Date
        ? rescheduleInfo.requestedAt.toISOString()
        : rescheduleInfo.requestedAt,
    };

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.RESCHEDULE_REQUESTED,
        rescheduleInfo: serializedInfo as any,
        updatedAt: new Date(),
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
      },
    });

    return this.mapToDomain(updated);
  }

  async cancel(bookingId: string, cancelledBy: string, reason: string): Promise<Booking> {
    // Delegates to transactional to ensure credit reversal happens
    return this.cancelTransactional(bookingId, cancelledBy, reason);
  }

  async delete(bookingId: string): Promise<void> {
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });
  }

  // --- Optimized Analytics ---

  async getProviderStats(providerId: string): Promise<{
    pending: number;
    confirmed: number;
    reschedule: number;
    completed: number;
    cancelled: number;
  }> {
    // Optimization: Use groupBy instead of 5 separate count queries
    const stats = await this.prisma.booking.groupBy({
      by: ['status'],
      where: {
        providerId,
        isDeleted: false
      },
      _count: {
        status: true
      }
    });

    const result = { pending: 0, confirmed: 0, reschedule: 0, completed: 0, cancelled: 0 };

    stats.forEach(s => {
      const count = s._count.status;
      switch (s.status) {
        case 'pending': result.pending = count; break;
        case 'confirmed': result.confirmed = count; break;
        case 'reschedule_requested': result.reschedule = count; break;
        case 'completed': result.completed = count; break;
        case 'cancelled': result.cancelled = count; break;
      }
    });

    return result;
  }

  async acceptReschedule(bookingId: string, newDate: string, newTime: string): Promise<Booking> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Fetch booking and skill info
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { skill: true }
      });

      if (!booking) throw new NotFoundError('Booking not found');

      // 2. Calculate new time range
      const newDateObj = new Date(newDate);
      const [hours, minutes] = newTime.split(':').map(Number);
      const newStartAt = new Date(newDateObj);
      newStartAt.setHours(hours, minutes, 0, 0);

      const newEndAt = new Date(newStartAt.getTime() + booking.skill.durationHours * 60 * 60 * 1000);

      // 3. CHECK FOR OVERLAPS AT NEW TIME - CRITICAL FIX FOR RACE CONDITION
      const overlaps = await tx.booking.count({
        where: {
          providerId: booking.providerId,
          status: { in: ['pending', 'confirmed'] },
          isDeleted: false,
          id: { not: bookingId }, // Exclude current booking
          AND: [
            { startAt: { lt: newEndAt } },
            { endAt: { gt: newStartAt } }
          ] as any
        }
      });

      if (overlaps > 0) {
        throw new ConflictError('Rescheduled time slot conflicts with another booking');
      }

      // 4. Update booking with new schedule
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          preferredDate: newDateObj,
          preferredTime: newTime,
          startAt: newStartAt,
          endAt: newEndAt,
          status: BookingStatus.CONFIRMED,
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

  async declineReschedule(bookingId: string, reason: string): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED, // Revert to confirmed
        rescheduleInfo: Prisma.JsonNull, // Clear request
        rejectionReason: reason,         // Store the reason for declining
        updatedAt: new Date(),
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
      },
    });

    return this.mapToDomain(updated);
  }
}