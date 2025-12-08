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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepository = void 0;
const client_1 = require("@prisma/client");
const inversify_1 = require("inversify");
const Booking_1 = require("../../domain/entities/Booking");
let BookingRepository = class BookingRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    mapToDomain(data) {
        // Deserialize rescheduleInfo if present
        let rescheduleInfo = null;
        if (data.rescheduleInfo) {
            rescheduleInfo = {
                ...data.rescheduleInfo,
                requestedAt: typeof data.rescheduleInfo.requestedAt === 'string'
                    ? new Date(data.rescheduleInfo.requestedAt)
                    : data.rescheduleInfo.requestedAt,
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
            sessionType: undefined,
            message: data.message,
            notes: data.notes,
            status: data.status,
            sessionCost: data.sessionCost,
            rescheduleInfo,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }
    async findById(bookingId) {
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
    async findByProviderId(providerId) {
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
        return bookings.map((b) => this.mapToDomain(b));
    }
    async findByLearnerId(learnerId) {
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
    async findByProviderIdAndStatus(providerId, status) {
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
    async findByLearnerIdAndStatus(learnerId, status) {
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
    async create(booking) {
        const created = await this.prisma.booking.create({
            data: {
                id: booking.id,
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
    async updateStatus(bookingId, status) {
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
    async updateWithReschedule(bookingId, rescheduleInfo) {
        // Convert Date objects to ISO strings for JSON storage
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
    async cancel(bookingId, cancelledBy, reason) {
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: Booking_1.BookingStatus.CANCELLED,
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
    async delete(bookingId) {
        await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                isDeleted: true,
                updatedAt: new Date(),
            },
        });
    }
    async getProviderStats(providerId) {
        const [pending, confirmed, reschedule, completed, cancelled] = await Promise.all([
            this.prisma.booking.count({
                where: { providerId, status: Booking_1.BookingStatus.PENDING, isDeleted: false },
            }),
            this.prisma.booking.count({
                where: { providerId, status: Booking_1.BookingStatus.CONFIRMED, isDeleted: false },
            }),
            this.prisma.booking.count({
                where: { providerId, status: Booking_1.BookingStatus.RESCHEDULE_REQUESTED, isDeleted: false },
            }),
            this.prisma.booking.count({
                where: { providerId, status: Booking_1.BookingStatus.COMPLETED, isDeleted: false },
            }),
            this.prisma.booking.count({
                where: { providerId, status: Booking_1.BookingStatus.CANCELLED, isDeleted: false },
            }),
        ]);
        return { pending, confirmed, reschedule, completed, cancelled };
    }
    async acceptReschedule(bookingId, newDate, newTime) {
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                preferredDate: new Date(newDate),
                preferredTime: newTime,
                status: Booking_1.BookingStatus.CONFIRMED,
                rescheduleInfo: client_1.Prisma.JsonNull,
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
    async declineReschedule(bookingId, _reason) {
        // Note: reason is not stored in DB as there's no declineReason field
        const updated = await this.prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: Booking_1.BookingStatus.CONFIRMED,
                rescheduleInfo: client_1.Prisma.JsonNull,
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
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], BookingRepository);
//# sourceMappingURL=BookingRepository.js.map