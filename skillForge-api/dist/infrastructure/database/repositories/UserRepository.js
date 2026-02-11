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
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
const Database_1 = require("../Database");
const User_1 = require("../../../domain/entities/User");
const types_1 = require("../../di/types");
const BaseRepository_1 = require("../BaseRepository");
let UserRepository = class UserRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'user');
    }
    async findById(id) {
        const user = await super.findById(id);
        return user ? User_1.User.fromDatabaseRow(user) : null;
    }
    async findByIds(ids) {
        const users = await this.prisma.user.findMany({
            where: {
                id: { in: ids }
            }
        });
        return users.map((u) => User_1.User.fromDatabaseRow(u));
    }
    async findByEmail(email) {
        const user = await this.getOne({
            where: {
                email: email.toLowerCase(),
                isDeleted: false
            }
        });
        if (!user) {
            return null;
        }
        return User_1.User.fromDatabaseRow(user);
    }
    async findAll() {
        const users = await super.findAll();
        return users.map((u) => User_1.User.fromDatabaseRow(u));
    }
    mapUserDataToPrisma(user) {
        const userData = user.toJSON();
        return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            passwordHash: userData.password_hash || userData.passwordHash, // Prisma uses camelCase
            avatarUrl: userData.avatar_url,
            bio: userData.bio,
            location: userData.location,
            role: userData.role,
            credits: userData.credits,
            earnedCredits: userData.earned_credits,
            bonusCredits: userData.bonus_credits,
            purchasedCredits: userData.purchased_credits,
            walletBalance: userData.wallet_balance,
            skillsOffered: userData.skills_offered,
            skillsLearning: userData.skills_learning,
            rating: userData.rating,
            reviewCount: userData.review_count,
            totalSessionsCompleted: userData.total_sessions_completed,
            memberSince: userData.member_since,
            verification: userData.verification,
            antiFraud: userData.anti_fraud,
            adminPermissions: userData.admin_permissions,
            settings: userData.settings,
            subscriptionPlan: userData.subscription_plan,
            subscriptionValidUntil: userData.subscription_valid_until,
            subscriptionAutoRenew: userData.subscription_auto_renew,
            subscriptionStartedAt: userData.subscription_started_at,
            createdAt: userData.created_at,
            updatedAt: userData.updated_at,
            lastLogin: userData.last_login,
            lastActive: userData.last_active,
            isActive: userData.is_active,
            isDeleted: userData.is_deleted
        };
    }
    async save(user) {
        const data = this.mapUserDataToPrisma(user);
        const savedUser = await this.create(data);
        return User_1.User.fromDatabaseRow(savedUser);
    }
    async update(user) {
        const data = this.mapUserDataToPrisma(user);
        const updateData = Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'id' && key !== 'created_at'));
        // Directly use Prisma client to avoid signature conflict with base class
        const modelClient = this.prisma[this.model];
        const updatedUser = await modelClient.update({
            where: { id: user.id },
            data: updateData
        });
        return User_1.User.fromDatabaseRow(updatedUser);
    }
    async findWithPagination(filters, pagination) {
        const where = { isDeleted: false };
        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        if (filters.role) {
            where.role = filters.role;
        }
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip: pagination.skip,
                take: pagination.take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            users: users.map((u) => User_1.User.fromDatabaseRow(u)),
            total,
        };
    }
    async delete(id) {
        await super.delete(id);
    }
    async addPurchasedCredits(userId, credits) {
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                credits: { increment: credits },
                purchasedCredits: { increment: credits }
            }
        });
        return User_1.User.fromDatabaseRow(updated);
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], UserRepository);
//# sourceMappingURL=UserRepository.js.map