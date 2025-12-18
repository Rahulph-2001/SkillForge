"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepository = void 0;
const types_1 = require("../../../infrastructure/di/types");
const client_1 = require("@prisma/client");
const inversify_1 = require("inversify");
const Booking_1 = require("../../../domain/entities/Booking");
const Database_1 = require("../Database");
const AppError_1 = require("../../../domain/errors/AppError");
let BookingRepository = class BookingRepository {
    constructor(db) {
        this.prisma = db.getClient();
    }
    // --- Helper: Mapper ---
    mapToDomain(data) {
        let rescheduleInfo = null;
        // Handle Prisma JSON type safely
        if (data.rescheduleInfo && typeof data.rescheduleInfo === 'object') {
            const info = data.rescheduleInfo;
            rescheduleInfo = {
                ...info,
                requestedAt: info.requestedAt ? new Date(info.requestedAt) : new Date(),
            };
        }
        return Booking_1.Booking.create({
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
            status: data.status,
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
    async findById(bookingId) {
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
    async findByProviderId(providerId) {
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
    async findByLearnerId(learnerId) {
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
    async findByProviderIdAndStatus(providerId, status) {
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
    async findByLearnerIdAndStatus(learnerId, status) {
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
    async findOverlapping(providerId, date, startTime, endTime) {
        const targetDate = new Date(date);
        // Fetch all active bookings for the day
        const bookings = await this.prisma.booking.findMany({
            where: {
                providerId,
                preferredDate: targetDate,
                status: { in: [Booking_1.BookingStatus.PENDING, Booking_1.BookingStatus.CONFIRMED] },
                isDeleted: false,
            },
            include: {
                skill: { select: { durationHours: true } }
            }
        });
        const toMinutes = (time) => {
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
    async findInDateRange(providerId, startDate, endDate) {
        const bookings = await this.prisma.booking.findMany({
            where: {
                providerId,
                preferredDate: {
                    gte: startDate,
                    lte: endDate,
                },
                status: { in: [Booking_1.BookingStatus.PENDING, Booking_1.BookingStatus.CONFIRMED] },
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
    async findOverlappingWithBuffer(providerId, date, startTime, endTime, bufferMinutes) {
        const targetDate = new Date(date);
        const bookings = await this.prisma.booking.findMany({
            where: {
                providerId,
                preferredDate: targetDate,
                status: { in: [Booking_1.BookingStatus.PENDING, Booking_1.BookingStatus.CONFIRMED] },
                isDeleted: false,
            },
            include: {
                skill: { select: { durationHours: true } }
            }
        });
        const toMinutes = (time) => {
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
    async countActiveBookingsByProviderAndDate(providerId, dateString) {
        const date = new Date(dateString);
        return await this.prisma.booking.count({
            where: {
                providerId,
                preferredDate: date,
                status: { in: [Booking_1.BookingStatus.PENDING, Booking_1.BookingStatus.CONFIRMED] },
                isDeleted: false
            }
        });
    }
    /**
     * Find duplicate booking (idempotency check)
     */
    async findDuplicateBooking(learnerId, skillId, preferredDate, preferredTime) {
        const date = new Date(preferredDate);
        const booking = await this.prisma.booking.findFirst({
            where: {
                learnerId,
                skillId,
                preferredDate: date,
                preferredTime,
                status: { in: [Booking_1.BookingStatus.PENDING, Booking_1.BookingStatus.CONFIRMED] },
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
    async createTransactional(booking, sessionCost) {
        const domainBooking = booking.toObject();
        return await this.prisma.$transaction(async (tx) => {
            // 1. Lock & Check Learner Balance
            const learner = await tx.user.findUnique({
                where: { id: domainBooking.learnerId }
            });
            if (!learner)
                throw new AppError_1.NotFoundError('Learner Not Found');
            if (learner.credits < sessionCost) {
                throw new AppError_1.ValidationError('Insufficient credits to complete this booking');
            }
            // 2. Double-check for overlap (Optimistic Concurrency Control)
            // Using Industrial Level Range Check (StartA < EndB) && (EndA > StartB)
            // We look for any booking that overlaps with our desired range
            const startAt = domainBooking.startAt;
            const endAt = domainBooking.endAt;
            if (!startAt || !endAt) {
                throw new AppError_1.ValidationError("Booking missing start/end time");
            }
            const existingCount = await tx.booking.count({
                where: {
                    providerId: domainBooking.providerId,
                    status: { in: ['pending', 'confirmed'] },
                    isDeleted: false,
                    AND: [
                        { startAt: { lt: endAt } },
                        { endAt: { gt: startAt } }
                    ]
                }
            });
            if (existingCount > 0) {
                throw new AppError_1.ConflictError('Slot was just taken by another user');
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
                },
                include: {
                    skill: { select: { title: true, durationHours: true } },
                    provider: { select: { name: true, avatarUrl: true } },
                    learner: { select: { name: true, avatarUrl: true } }
                }
            });
            return this.mapToDomain(createdBooking);
        });
    }
    async confirmTransactional(bookingId) {
        return await this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({ where: { id: bookingId } });
            if (!booking)
                throw new AppError_1.NotFoundError("Booking not found");
            if (booking.status !== Booking_1.BookingStatus.PENDING)
                throw new AppError_1.ValidationError("Booking is not pending");
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
                    status: Booking_1.BookingStatus.CONFIRMED,
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
    async cancelTransactional(bookingId, cancelledBy, reason) {
        return await this.prisma.$transaction(async (tx) => {
            // 1. Fetch existing booking
            const booking = await tx.booking.findUnique({
                where: { id: bookingId }
            });
            if (!booking)
                throw new AppError_1.NotFoundError('Booking not found');
            // Check if already cancelled
            if (booking.status === 'cancelled' || booking.status === 'rejected') {
                throw new AppError_1.ConflictError('Booking is already cancelled or rejected');
            }
            // 2. Reverse Credits
            const cost = booking.sessionCost;
            // Refund Learner
            await tx.user.update({
                where: { id: booking.learnerId },
                data: { credits: { increment: cost } }
            });
            // Deduct from Provider ONLY if previously credited (Confirmed/Completed)
            if (booking.status === Booking_1.BookingStatus.CONFIRMED || booking.status === Booking_1.BookingStatus.COMPLETED) {
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
                    status: Booking_1.BookingStatus.CANCELLED,
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
    async create(booking) {
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
    async updateStatus(bookingId, status, reason) {
        return await this.prisma.$transaction(async (tx) => {
            // 1. Fetch Booking to get cost and learner
            const booking = await tx.booking.findUnique({ where: { id: bookingId } });
            if (!booking)
                throw new AppError_1.NotFoundError('Booking not found');
            // 2. Handle Rejection Refund (Escrow Release back to Learner)
            if (status === Booking_1.BookingStatus.REJECTED && booking.status === Booking_1.BookingStatus.PENDING) {
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
                    rejectionReason: status === Booking_1.BookingStatus.REJECTED ? reason : undefined,
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
    async updateWithReschedule(bookingId, rescheduleInfo) {
        const serializedInfo = {
            ...rescheduleInfo,
            requestedAt: rescheduleInfo.requestedAt instanceof Date
                ? rescheduleInfo.requestedAt.toISOString()
                : rescheduleInfo.requestedAt,
        };
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: Booking_1.BookingStatus.RESCHEDULE_REQUESTED,
                rescheduleInfo: serializedInfo,
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
    async cancel(bookingId, cancelledBy, reason) {
        // Delegates to transactional to ensure credit reversal happens
        return this.cancelTransactional(bookingId, cancelledBy, reason);
    }
    async delete(bookingId) {
        await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                isDeleted: true,
                updatedAt: new Date(),
            },
        });
    }
    // --- Optimized Analytics ---
    async getProviderStats(providerId) {
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
                case 'pending':
                    result.pending = count;
                    break;
                case 'confirmed':
                    result.confirmed = count;
                    break;
                case 'reschedule_requested':
                    result.reschedule = count;
                    break;
                case 'completed':
                    result.completed = count;
                    break;
                case 'cancelled':
                    result.cancelled = count;
                    break;
            }
        });
        return result;
    }
    async acceptReschedule(bookingId, newDate, newTime) {
        return await this.prisma.$transaction(async (tx) => {
            // 1. Fetch booking and skill info
            const booking = await tx.booking.findUnique({
                where: { id: bookingId },
                include: { skill: true }
            });
            if (!booking)
                throw new AppError_1.NotFoundError('Booking not found');
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
                    ]
                }
            });
            if (overlaps > 0) {
                throw new AppError_1.ConflictError('Rescheduled time slot conflicts with another booking');
            }
            // 4. Update booking with new schedule
            const updated = await tx.booking.update({
                where: { id: bookingId },
                data: {
                    preferredDate: newDateObj,
                    preferredTime: newTime,
                    startAt: newStartAt,
                    endAt: newEndAt,
                    status: Booking_1.BookingStatus.CONFIRMED,
                    rescheduleInfo: client_1.Prisma.JsonNull,
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
    async declineReschedule(bookingId, reason) {
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: Booking_1.BookingStatus.CONFIRMED, // Revert to confirmed
                rescheduleInfo: client_1.Prisma.JsonNull, // Clear request
                rejectionReason: reason, // Store the reason for declining
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
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], BookingRepository);
//# sourceMappingURL=BookingRepository.js.map