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
exports.EscrowRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const EscrowTransaction_1 = require("../../../domain/entities/EscrowTransaction");
const Database_1 = require("../Database");
const BaseRepository_1 = require("../BaseRepository");
const AppError_1 = require("../../../domain/errors/AppError");
let EscrowRepository = class EscrowRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'escrowTransaction');
    }
    mapToDomain(data) {
        return EscrowTransaction_1.EscrowTransaction.fromDatabaseRow(data);
    }
    async findByBookingId(bookingId) {
        const escrow = await this.prisma.escrowTransaction.findUnique({
            where: { bookingId },
        });
        return escrow ? this.mapToDomain(escrow) : null;
    }
    async findByLearnerId(learnerId) {
        const escrows = await this.prisma.escrowTransaction.findMany({
            where: { learnerId },
            orderBy: { createdAt: 'desc' },
        });
        return escrows.map((e) => this.mapToDomain(e));
    }
    async findByProviderId(providerId) {
        const escrows = await this.prisma.escrowTransaction.findMany({
            where: { providerId },
            orderBy: { createdAt: 'desc' },
        });
        return escrows.map((e) => this.mapToDomain(e));
    }
    async holdCredits(bookingId, learnerId, providerId, amount) {
        return await this.prisma.$transaction(async (tx) => {
            const learner = await tx.user.findUnique({
                where: { id: learnerId },
            });
            if (!learner) {
                throw new AppError_1.NotFoundError('Learner not found');
            }
            if (learner.credits < amount) {
                throw new AppError_1.ValidationError(`Insufficient credits. Required: ${amount}, Available: ${learner.credits}`);
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
    async releaseCredits(bookingId) {
        return await this.prisma.$transaction(async (tx) => {
            const escrow = await tx.escrowTransaction.findUnique({
                where: { bookingId },
            });
            if (!escrow) {
                throw new AppError_1.NotFoundError('Escrow transaction not found');
            }
            if (escrow.status !== 'HELD') {
                throw new AppError_1.ValidationError(`Cannot release escrow with status: ${escrow.status}`);
            }
            await tx.user.update({
                where: { id: escrow.learnerId },
                data: {
                    heldCredits: { decrement: escrow.amount },
                },
            });
            await tx.user.update({
                where: { id: escrow.providerId },
                data: {
                    credits: { increment: escrow.amount },
                    earnedCredits: { increment: escrow.amount },
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
    async refundCredits(bookingId) {
        return await this.prisma.$transaction(async (tx) => {
            const escrow = await tx.escrowTransaction.findUnique({
                where: { bookingId },
            });
            if (!escrow) {
                throw new AppError_1.NotFoundError('Escrow transaction not found');
            }
            if (escrow.status !== 'HELD') {
                throw new AppError_1.ValidationError(`Cannot refund escrow with status: ${escrow.status}`);
            }
            await tx.user.update({
                where: { id: escrow.learnerId },
                data: {
                    credits: { increment: escrow.amount },
                    heldCredits: { decrement: escrow.amount },
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
    async getEscrowStats(userId) {
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
};
exports.EscrowRepository = EscrowRepository;
exports.EscrowRepository = EscrowRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], EscrowRepository);
//# sourceMappingURL=EscrowRepository.js.map