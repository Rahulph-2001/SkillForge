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
const BaseRepository_1 = require("../BaseRepository");
const AppError_1 = require("../../../domain/errors/AppError");
let BookingRepository = class BookingRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'booking');
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
            isReviewed: !!data.review,
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
                review: { select: { id: true } },
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
                review: { select: { id: true } },
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
                review: { select: { id: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return bookings.map((b) => this.mapToDomain(b));
    }
    async findDuplicateBooking(learnerId, skillId, preferredDate, preferredTime) {
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
    async create(booking) {
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
                rescheduleInfo: domainBooking.rescheduleInfo,
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
    async createWithEscrow(booking, sessionCost) {
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
            const startAt = domainBooking.startAt;
            const endAt = domainBooking.endAt;
            if (!startAt || !endAt) {
                throw new AppError_1.ValidationError("Booking missing start/end time");
            }
            const existingCount = await tx.booking.count({
                where: {
                    providerId: domainBooking.providerId,
                    status: { in: ['pending', 'confirmed', 'reschedule_requested'] },
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
                    rescheduleInfo: domainBooking.rescheduleInfo,
                },
                include: {
                    skill: { select: { title: true, durationHours: true } },
                    provider: { select: { name: true, avatarUrl: true } },
                    learner: { select: { name: true, avatarUrl: true } },
                    review: { select: { id: true } },
                },
            });
            // 4b. Log Wallet Transaction (SESSION_PAYMENT)
            // Amount is NEGATIVE because credits are being locked/held in escrow
            // @ts-ignore
            await tx.userWalletTransaction.create({
                data: {
                    userId: domainBooking.learnerId,
                    type: 'SESSION_PAYMENT',
                    amount: -sessionCost, // Negative amount - credits are being locked/held
                    currency: 'CREDITS',
                    source: 'SESSION_BOOKING',
                    referenceId: created.id,
                    description: `Booking for ${domainBooking.skillTitle || 'Session'}`,
                    previousBalance: new client_1.Prisma.Decimal(Number(updatedLearner.credits) + sessionCost),
                    newBalance: new client_1.Prisma.Decimal(updatedLearner.credits),
                    status: 'COMPLETED',
                    metadata: {
                        sessionCost: sessionCost,
                        skillTitle: domainBooking.skillTitle,
                        providerId: domainBooking.providerId,
                    },
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
    async acceptBooking(bookingId) {
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
    async declineBooking(bookingId, reason) {
        return await this.prisma.$transaction(async (tx) => {
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
                throw new AppError_1.NotFoundError('Booking not found');
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
                    status: 'rejected',
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
    async rescheduleBooking(bookingId, rescheduleInfo) {
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'reschedule_requested',
                rescheduleInfo: rescheduleInfo,
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
    async delete(id) {
        await super.delete(id);
    }
    async findByProviderIdAndStatus(providerId, status) {
        const bookings = await this.prisma.booking.findMany({
            where: { providerId, status: status, isDeleted: false },
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
    async findByLearnerIdAndStatus(learnerId, status) {
        const bookings = await this.prisma.booking.findMany({
            where: { learnerId, status: status, isDeleted: false },
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
    async findOverlapping(providerId, date, startTime, endTime) {
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
    async findInDateRange(providerId, startDate, endDate) {
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
    async findOverlappingWithBuffer(providerId, date, startTime, endTime, bufferMinutes) {
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
    async countActiveBookingsByProviderAndDate(providerId, dateString) {
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
    async updateStatus(bookingId, status, reason) {
        return await this.prisma.$transaction(async (tx) => {
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
                throw new AppError_1.NotFoundError('Booking not found');
            }
            const previousStatus = booking.status;
            // 2. (Refactored) Credit refunds are now handled by specific Use Cases via EscrowRepository
            // This ensures Single Responsibility and prevents double-refunds.
            // 3. Update booking status with appropriate reason field
            const updateData = {
                status: status,
                updatedAt: new Date(),
            };
            // Set the correct reason field based on status
            if (status === Booking_1.BookingStatus.REJECTED) {
                updateData.rejectionReason = reason;
            }
            else if (status === Booking_1.BookingStatus.CANCELLED) {
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
    async updateWithReschedule(bookingId, rescheduleInfo) {
        return await this.rescheduleBooking(bookingId, rescheduleInfo);
    }
    async acceptReschedule(bookingId, newDate, newTime) {
        return await this.prisma.$transaction(async (tx) => {
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
                throw new AppError_1.NotFoundError('Booking or reschedule info not found');
            }
            const rescheduleInfo = booking.rescheduleInfo;
            // 2. Calculate new start/end times (use provided or calculate from skill duration)
            let newStartAt;
            let newEndAt;
            if (rescheduleInfo.newStartAt && rescheduleInfo.newEndAt) {
                newStartAt = new Date(rescheduleInfo.newStartAt);
                newEndAt = new Date(rescheduleInfo.newEndAt);
            }
            else {
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
                    ]
                }
            });
            if (conflictingBooking) {
                throw new AppError_1.ConflictError('New time slot conflicts with an existing booking');
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
    async declineReschedule(bookingId, _reason) {
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'confirmed',
                rescheduleInfo: client_1.Prisma.JsonNull,
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
    async getProviderStats(providerId) {
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
    async listAll(page, limit, search) {
        const skip = (page - 1) * limit;
        const where = {
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
    async getGlobalStats() {
        const [totalSessions, completed, upcoming, cancelled] = await Promise.all([
            this.prisma.booking.count({ where: { isDeleted: false } }),
            this.prisma.booking.count({ where: { status: 'completed', isDeleted: false } }),
            this.prisma.booking.count({ where: { status: { in: ['pending', 'confirmed'] }, isDeleted: false } }),
            this.prisma.booking.count({ where: { status: 'cancelled', isDeleted: false } }),
        ]);
        return { totalSessions, completed, upcoming, cancelled };
    }
    async countTotal() {
        return await this.prisma.booking.count({
            where: { isDeleted: false }
        });
    }
    async countByStatus(status) {
        return await this.prisma.booking.count({
            where: {
                isDeleted: false,
                status: status
            }
        });
    }
    async countByDateRange(startDate, endDate) {
        return await this.prisma.booking.count({
            where: {
                isDeleted: false,
                createdAt: { gte: startDate, lte: endDate }
            }
        });
    }
    async countByStatusAndDateRange(status, startDate, endDate) {
        return await this.prisma.booking.count({
            where: {
                isDeleted: false,
                status: status,
                createdAt: { gte: startDate, lte: endDate }
            }
        });
    }
    async findRecent(limit) {
        const bookings = await this.prisma.booking.findMany({
            where: { isDeleted: false },
            include: {
                skill: true,
                provider: true,
                learner: true
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
        return bookings.map(b => this.mapToDomain(b));
    }
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], BookingRepository);
//# sourceMappingURL=BookingRepository.js.map