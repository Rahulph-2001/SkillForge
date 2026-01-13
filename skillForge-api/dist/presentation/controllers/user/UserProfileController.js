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
let UserProfileController = class UserProfileController {
    constructor(getProviderProfileUseCase, getProviderReviewsUseCase, getUserProfileUseCase, updateUserProfileUseCase, responseBuilder) {
        this.getProviderProfileUseCase = getProviderProfileUseCase;
        this.getProviderReviewsUseCase = getProviderReviewsUseCase;
        this.getUserProfileUseCase = getUserProfileUseCase;
        this.updateUserProfileUseCase = updateUserProfileUseCase;
        this.responseBuilder = responseBuilder;
    }
    async getProviderProfile(req, res, next) {
        try {
            const { userId } = req.params;
            const profile = await this.getProviderProfileUseCase.execute(userId);
            const response = this.responseBuilder.success(profile, 'Profile fetched successfully', HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async getProviderReviews(req, res, next) {
        try {
            const { userId } = req.params;
            const reviews = await this.getProviderReviewsUseCase.execute(userId);
            const response = this.responseBuilder.success(reviews, 'Reviews fetched successfully', HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async getProfile(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({
                    success: false,
                    error: 'User not authenticated',
                });
                return;
            }
            const profile = await this.getUserProfileUseCase.execute(userId);
            const response = this.responseBuilder.success(profile, 'Profile fetched successfully', HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED).json({
                    success: false,
                    error: 'User not authenticated',
                });
                return;
            }
            const { name, bio, location } = req.body;
            const avatarFile = req.file;
            const result = await this.updateUserProfileUseCase.execute({
                userId,
                name,
                bio,
                location,
                avatarFile: avatarFile ? {
                    buffer: avatarFile.buffer,
                    originalname: avatarFile.originalname,
                    mimetype: avatarFile.mimetype,
                } : undefined,
            });
            const response = this.responseBuilder.success(result, 'Profile updated successfully', HttpStatusCode_1.HttpStatusCode.OK);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.UserProfileController = UserProfileController;
exports.UserProfileController = UserProfileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IGetProviderProfileUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IGetProviderReviewsUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IGetUserProfileUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IUpdateUserProfileUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], UserProfileController);
//# sourceMappingURL=UserProfileController.js.map