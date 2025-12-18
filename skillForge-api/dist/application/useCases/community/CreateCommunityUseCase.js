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
exports.CreateCommunityUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Community_1 = require("../../../domain/entities/Community");
const CommunityMember_1 = require("../../../domain/entities/CommunityMember");
const AppError_1 = require("../../../domain/errors/AppError");
const client_1 = require("@prisma/client");
let CreateCommunityUseCase = class CreateCommunityUseCase {
    constructor(communityRepository, s3Service, prisma) {
        this.communityRepository = communityRepository;
        this.s3Service = s3Service;
        this.prisma = prisma;
    }
    async execute(userId, dto, imageFile) {
        if (!dto.name || dto.name.trim().length === 0) {
            throw new AppError_1.ValidationError('Community name is required');
        }
        if (!dto.description || dto.description.trim().length === 0) {
            throw new AppError_1.ValidationError('Community description is required');
        }
        if (!dto.category || dto.category.trim().length === 0) {
            throw new AppError_1.ValidationError('Community category is required');
        }
        let imageUrl = null;
        if (imageFile) {
            // Validate file size (max 5MB)
            if (imageFile.buffer.length > 5 * 1024 * 1024) {
                throw new AppError_1.ValidationError('Image size must be less than 5MB');
            }
            // Validate file type
            if (!imageFile.mimetype.startsWith('image/')) {
                throw new AppError_1.ValidationError('Only image files are allowed');
            }
            try {
                const timestamp = Date.now();
                const key = `communities/${userId}/${timestamp}-${imageFile.originalname}`;
                imageUrl = await this.s3Service.uploadFile(imageFile.buffer, key, imageFile.mimetype);
            }
            catch (error) {
                throw new Error('Failed to upload image. Please try again.');
            }
        }
        // Use transaction to ensure community and admin member are created atomically
        return await this.prisma.$transaction(async (tx) => {
            const community = new Community_1.Community({
                name: dto.name,
                description: dto.description,
                category: dto.category,
                imageUrl,
                adminId: userId,
                creditsCost: dto.creditsCost,
                creditsPeriod: dto.creditsPeriod,
            });
            const communityData = community.toJSON();
            await tx.community.create({
                data: {
                    id: communityData.id,
                    name: communityData.name,
                    description: communityData.description,
                    category: communityData.category,
                    imageUrl: communityData.image_url,
                    videoUrl: communityData.video_url,
                    adminId: communityData.admin_id,
                    creditsCost: communityData.credits_cost,
                    creditsPeriod: communityData.credits_period,
                    membersCount: 1, // Admin is first member
                    isActive: communityData.is_active,
                    isDeleted: communityData.is_deleted,
                    createdAt: communityData.created_at,
                    updatedAt: communityData.updated_at,
                },
            });
            // Add creator as admin member
            const adminMember = new CommunityMember_1.CommunityMember({
                communityId: community.id,
                userId,
                role: 'admin',
            });
            const memberData = adminMember.toJSON();
            await tx.communityMember.create({
                data: {
                    id: memberData.id,
                    communityId: memberData.community_id,
                    userId: memberData.user_id,
                    role: memberData.role,
                    isAutoRenew: memberData.is_auto_renew,
                    subscriptionEndsAt: memberData.subscription_ends_at,
                    joinedAt: memberData.joined_at,
                    isActive: memberData.is_active,
                },
            });
            return community;
        });
    }
};
exports.CreateCommunityUseCase = CreateCommunityUseCase;
exports.CreateCommunityUseCase = CreateCommunityUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IS3Service)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [Object, Object, client_1.PrismaClient])
], CreateCommunityUseCase);
//# sourceMappingURL=CreateCommunityUseCase.js.map