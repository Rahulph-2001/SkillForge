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
            },
        });
        return this.mapToDomain(created);
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
                    rescheduleInfo: domainBooking.rescheduleInfo,
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
    async cancelTransactional(bookingId, _cancelledBy, reason) {
        return await this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.findUnique({
                where: { id: bookingId },
                include: { skill: true }
            });
            if (!booking)
                throw new AppError_1.NotFoundError('Booking not found');
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
    async acceptBooking(bookingId) {
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
    async declineBooking(bookingId, reason) {
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
                status: 'declined',
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
                status: { in: ['pending', 'confirmed'] },
                isDeleted: false,
            },
        });
    }
    async confirmTransactional(bookingId) {
        return await this.acceptBooking(bookingId);
    }
    async updateStatus(bookingId, status, reason) {
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: status,
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
    async updateWithReschedule(bookingId, rescheduleInfo) {
        return await this.rescheduleBooking(bookingId, rescheduleInfo);
    }
    async acceptReschedule(bookingId, newDate, newTime) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId }
        });
        if (!booking || !booking.rescheduleInfo) {
            throw new AppError_1.NotFoundError('Booking or reschedule info not found');
        }
        const rescheduleInfo = booking.rescheduleInfo;
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
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], BookingRepository);
//# sourceMappingURL=BookingRepository.js.map