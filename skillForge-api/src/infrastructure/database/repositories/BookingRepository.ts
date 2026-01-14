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
      },
    });
    return this.mapToDomain(created);
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
      await tx.user.update({
        where: { id: domainBooking.learnerId },
        data: { credits: { decrement: sessionCost } }
      });

      // 4. Create Booking
      // Convert preferredDate string to Date object for Prisma
      const preferredDateObj = new Date(domainBooking.preferredDate);

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
        },
      });

      return this.mapToDomain(created);
    });
  }

  async cancelTransactional(bookingId: string, _cancelledBy: string, reason: string): Promise<Booking> {
    return await this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { skill: true }
      });

      if (!booking) throw new NotFoundError('Booking not found');

      // Refund credits to learner
      if (booking.status === 'confirmed' || booking.status === 'pending') {
        await tx.user.update({
          where: { id: booking.learnerId },
          data: { credits: { increment: booking.sessionCost } }
        });
      }

      // Update booking status
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'cancelled',
          rejectionReason: reason,
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

  async acceptBooking(bookingId: string): Promise<Booking> {
    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'confirmed', updatedAt: new Date() },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
      },
    });

    return this.mapToDomain(booking);
  }

  async declineBooking(bookingId: string, reason: string): Promise<Booking> {
    // Refund credits
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (booking) {
      await this.prisma.user.update({
        where: { id: booking.learnerId },
        data: { credits: { increment: booking.sessionCost } }
      });
    }

    const declined = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'declined' as BookingStatus,
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
      },
      include: {
        skill: { select: { title: true, durationHours: true } },
        provider: { select: { name: true, avatarUrl: true } },
        learner: { select: { name: true, avatarUrl: true } },
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
        status: { in: ['pending', 'confirmed'] },
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
        status: { in: ['pending', 'confirmed'] },
        isDeleted: false,
      },
    });
  }

  async confirmTransactional(bookingId: string): Promise<Booking> {
    return await this.acceptBooking(bookingId);
  }

  async updateStatus(bookingId: string, status: BookingStatus, reason?: string): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: status as any,
        rejectionReason: reason,
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

  async updateWithReschedule(bookingId: string, rescheduleInfo: any): Promise<Booking> {
    return await this.rescheduleBooking(bookingId, rescheduleInfo);
  }

  async acceptReschedule(bookingId: string, newDate: string, newTime: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking || !booking.rescheduleInfo) {
      throw new NotFoundError('Booking or reschedule info not found');
    }

    const rescheduleInfo = booking.rescheduleInfo as any;
    // Convert preferredDate string to Date object for Prisma
    const preferredDateObj = new Date(newDate);

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'confirmed',
        preferredDate: preferredDateObj,
        preferredTime: newTime,
        startAt: rescheduleInfo.newStartAt ? new Date(rescheduleInfo.newStartAt) : null,
        endAt: rescheduleInfo.newEndAt ? new Date(rescheduleInfo.newEndAt) : null,
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