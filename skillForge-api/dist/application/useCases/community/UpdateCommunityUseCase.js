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
exports.UpdateCommunityUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const AppError_1 = require("../../../domain/errors/AppError");
const UserRole_1 = require("../../../domain/enums/UserRole");
let UpdateCommunityUseCase = class UpdateCommunityUseCase {
    constructor(communityRepository, storageService, userRepository) {
        this.communityRepository = communityRepository;
        this.storageService = storageService;
        this.userRepository = userRepository;
    }
    async execute(communityId, userId, dto, imageFile) {
        // 1. Verify community exists
        const community = await this.communityRepository.findById(communityId);
        if (!community) {
            throw new AppError_1.NotFoundError('Community not found');
        }
        // 2. Verify user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.ForbiddenError('User not found');
        }
        // 3. Authorization: Allow both community creator AND platform admin
        const isCommunityCreator = community.adminId === userId;
        const isPlatformAdmin = user.role === UserRole_1.UserRole.ADMIN;
        if (!isCommunityCreator && !isPlatformAdmin) {
            throw new AppError_1.ForbiddenError('Only community admin or platform admin can update community details');
        }
        // 4. Handle image upload
        let imageUrl = dto.imageUrl;
        if (imageFile) {
            // Delete old image if exists
            if (community.imageUrl) {
                await this.storageService.deleteFile(community.imageUrl);
            }
            const timestamp = Date.now();
            // Sanitize filename: replace spaces with hyphens and remove special characters
            const sanitizedFilename = imageFile.originalname
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/[^a-zA-Z0-9.-]/g, '') // Remove special characters except dots and hyphens
                .toLowerCase(); // Convert to lowercase for consistency
            const key = `communities/${userId}/${timestamp}-${sanitizedFilename}`;
            imageUrl = await this.storageService.uploadFile(imageFile.buffer, key, imageFile.mimetype);
        }
        // 5. Update community
        community.updateDetails({
            name: dto.name,
            description: dto.description,
            category: dto.category,
            imageUrl,
            videoUrl: dto.videoUrl,
            creditsCost: dto.creditsCost,
            creditsPeriod: dto.creditsPeriod,
        });
        return await this.communityRepository.update(communityId, community);
    }
};
exports.UpdateCommunityUseCase = UpdateCommunityUseCase;
exports.UpdateCommunityUseCase = UpdateCommunityUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IStorageService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UpdateCommunityUseCase);
//# sourceMappingURL=UpdateCommunityUseCase.js.map