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
exports.UserProfileController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
const messages_1 = require("../../../config/messages");
const client_1 = require("@prisma/client");
let UserProfileController = class UserProfileController {
    constructor(prisma, responseBuilder) {
        this.prisma = prisma;
        this.responseBuilder = responseBuilder;
        this.getProviderProfile = async (req, res, next) => {
            try {
                const { userId } = req.params;
                const user = await this.prisma.user.findUnique({
                    where: { id: userId, isDeleted: false, isActive: true },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                        bio: true,
                        location: true,
                        rating: true,
                        reviewCount: true,
                        totalSessionsCompleted: true,
                        memberSince: true,
                        verification: true,
                        skillsOffered: true,
                    },
                });
                if (!user) {
                    const response = this.responseBuilder.error('USER_NOT_FOUND', messages_1.ERROR_MESSAGES.USER.NOT_FOUND, HttpStatusCode_1.HttpStatusCode.NOT_FOUND);
                    res.status(response.statusCode).json(response.body);
                    return;
                }
                const response = this.responseBuilder.success(user, messages_1.SUCCESS_MESSAGES.USER.PROFILE_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getProfile = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const user = await this.prisma.user.findUnique({
                    where: { id: userId, isDeleted: false, isActive: true },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                        bio: true,
                        location: true,
                        rating: true,
                        reviewCount: true,
                        totalSessionsCompleted: true,
                        memberSince: true,
                        verification: true,
                        skillsOffered: true,
                        skillsLearning: true,
                        credits: true,
                        subscriptionPlan: true,
                    },
                });
                if (!user) {
                    const response = this.responseBuilder.error('USER_NOT_FOUND', messages_1.ERROR_MESSAGES.USER.NOT_FOUND, HttpStatusCode_1.HttpStatusCode.NOT_FOUND);
                    res.status(response.statusCode).json(response.body);
                    return;
                }
                const profileData = {
                    ...user,
                    skillsOffered: user.skillsOffered.length,
                };
                const response = this.responseBuilder.success(profileData, messages_1.SUCCESS_MESSAGES.USER.PROFILE_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProfile = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { name, bio, location } = req.body;
                const updateData = {};
                if (name)
                    updateData.name = name;
                if (bio !== undefined)
                    updateData.bio = bio;
                if (location !== undefined)
                    updateData.location = location;
                const user = await this.prisma.user.update({
                    where: { id: userId },
                    data: updateData,
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                        bio: true,
                        location: true,
                    },
                });
                const response = this.responseBuilder.success(user, messages_1.SUCCESS_MESSAGES.USER.PROFILE_UPDATED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getProviderReviews = async (req, res, next) => {
            try {
                const { userId } = req.params;
                const reviews = [];
                const response = this.responseBuilder.success(reviews, messages_1.SUCCESS_MESSAGES.USER.REVIEWS_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.UserProfileController = UserProfileController;
exports.UserProfileController = UserProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [client_1.PrismaClient, Object])
], UserProfileController);
//# sourceMappingURL=UserProfileController.js.map