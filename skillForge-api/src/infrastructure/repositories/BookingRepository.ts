/**
 * Booking Repository Implementation
 * Implements IBookingRepository using Prisma
 * Following Repository Pattern
 */

import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';
import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import { Booking, BookingStatus, RescheduleInfo } from '../../domain/entities/Booking';

@injectable()
export class BookingRepository implements IBookingRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private mapToDomain(data: any): Booking {
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
      sessionType: undefined,
      message: data.message,
      notes: data.notes,
      status: data.status as BookingStatus,
      sessionCost: data.sessionCost,
      rescheduleInfo: data.rescheduleInfo as RescheduleInfo | null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async findById(bookingId: string): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        skill: {
          select: {
            title: true,
            durationHours: true,
          },
        },
        provider: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        learner: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return booking ? this.mapToDomain(booking) : null;
  }

  async findByProviderId(providerId: string): Promise<Booking[]> {
    console.log('🔍 [BookingRepository] Finding bookings for provider:', providerId);
    
    const bookings = await this.prisma.booking.findMany({
      where: {
        providerId,
        isDeleted: false,
      },
      include: {
        skill: {
          select: {
            title: true,
            durationHours: true,
          },
        },
        provider: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        learner: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`✅ [BookingRepository] Found ${bookings.length} bookings for provider`);
    return bookings.map((b) => this.mapToDomain(b));
  }

  async findByLearnerId(learnerId: string): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        learnerId,
        isDeleted: false,
      },
      include: {
        skill: {
          select: {
            title: true,
            durationHours: true,
          },
        },
        provider: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        learner: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
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
        skill: {
          select: {
            title: true,
            durationHours: true,
          },
        },
        provider: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        learner: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
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
        skill: {
          select: {
            title: true,
            durationHours: true,
          },
        },
        provider: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        learner: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return bookings.map((b) => this.mapToDomain(b));
  }

  async create(booking: Booking): Promise<Booking> {
    const created = await this.prisma.booking.create({
      data: {
        id: booking.id,
        skillId: booking.skillId,
        providerId: booking.providerId,
        learnerId: booking.learnerId,
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime,
        message: booking.message,
        status: booking.status,
        sessionCost: booking.sessionCost,
      },
      include: {
        skill: {
          select: {
            title: true,
            durationHours: true,
          },
        },
        provider: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        learner: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return this.mapToDomain(created);
  }

  async updateStatus(bookingId: string, status: BookingStatus): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        skill: {
          select: {
            title: true,
            durationHours: true,
          },
        },
        provider: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        learner: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return this.mapToDomain(updated);
  }

  async updateWithReschedule(bookingId: string, rescheduleInfo: any): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.RESCHEDULE_REQUESTED,
        rescheduleInfo: rescheduleInfo as any,
        updatedAt: new Date(),
      },
      include: {
        skill: {
          select: {
            title: true,
            durationHours: true,
          },
        },
        provider: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        learner: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return this.mapToDomain(updated);
  }

  async cancel(bookingId: string, cancelledBy: string, reason: string): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledBy,
        cancelledReason: reason,
        updatedAt: new Date(),
      },
      include: {
        skill: {
          select: {
            title: true,
            durationHours: true,
          },
        },
        provider: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
        learner: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return this.mapToDomain(updated);
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

  async getProviderStats(providerId: string): Promise<{
    pending: number;
    confirmed: number;
    reschedule: number;
    completed: number;
    cancelled: number;
  }> {
    const [pending, confirmed, reschedule, completed, cancelled] = await Promise.all([
      this.prisma.booking.count({
        where: { providerId, status: BookingStatus.PENDING, isDeleted: false },
      }),
      this.prisma.booking.count({
        where: { providerId, status: BookingStatus.CONFIRMED, isDeleted: false },
      }),
      this.prisma.booking.count({
        where: { providerId, status: BookingStatus.RESCHEDULE_REQUESTED, isDeleted: false },
      }),
      this.prisma.booking.count({
        where: { providerId, status: BookingStatus.COMPLETED, isDeleted: false },
      }),
      this.prisma.booking.count({
        where: { providerId, status: BookingStatus.CANCELLED, isDeleted: false },
      }),
    ]);

    return { pending, confirmed, reschedule, completed, cancelled };
  }
}
