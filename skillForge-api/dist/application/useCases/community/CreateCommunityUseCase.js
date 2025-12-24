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
    constructor(communityRepository, storageService, prisma) {
        this.communityRepository = communityRepository;
        this.storageService = storageService;
        this.prisma = prisma;
    }
    async execute(userId, dto, imageFile) {
        console.log('🏗️  CreateCommunityUseCase - START');
        console.log('📝 Received DTO:', { name: dto.name, category: dto.category, creditsCost: dto.creditsCost });
        console.log('👤 User ID:', userId);
        console.log('🖼️  Has image file:', !!imageFile);
        if (!dto.name || dto.name.trim().length === 0) {
            console.error('❌ Validation failed: name is required');
            throw new AppError_1.ValidationError('Community name is required');
        }
        if (!dto.description || dto.description.trim().length === 0) {
            console.error('❌ Validation failed: description is required');
            throw new AppError_1.ValidationError('Community description is required');
        }
        if (!dto.category || dto.category.trim().length === 0) {
            console.error('❌ Validation failed: category is required');
            throw new AppError_1.ValidationError('Community category is required');
        }
        console.log('✅ Basic validation passed');
        let imageUrl = null;
        if (imageFile) {
            console.log('📸 Processing image upload...');
            // Validate file size (max 5MB)
            if (imageFile.buffer.length > 5 * 1024 * 1024) {
                console.error('❌ Image too large:', imageFile.buffer.length);
                throw new AppError_1.ValidationError('Image size must be less than 5MB');
            }
            // Validate file type
            if (!imageFile.mimetype.startsWith('image/')) {
                console.error('❌ Invalid file type:', imageFile.mimetype);
                throw new AppError_1.ValidationError('Only image files are allowed');
            }
            try {
                const timestamp = Date.now();
                const key = `communities/${userId}/${timestamp}-${imageFile.originalname}`;
                console.log('☁️  Uploading to S3 with key:', key);
                imageUrl = await this.storageService.uploadFile(imageFile.buffer, key, imageFile.mimetype);
                console.log('✅ Image uploaded successfully:', imageUrl);
            }
            catch (error) {
                console.error('❌ S3 upload failed:', error);
                throw new Error('Failed to upload image. Please try again.');
            }
        }
        console.log('🔄 Starting database transaction...');
        // Use transaction to ensure community and admin member are created atomically
        return await this.prisma.$transaction(async (tx) => {
            console.log('🏛️  Creating Community entity...');
            const community = new Community_1.Community({
                name: dto.name,
                description: dto.description,
                category: dto.category,
                imageUrl,
                adminId: userId,
                creditsCost: dto.creditsCost,
                creditsPeriod: dto.creditsPeriod,
            });
            console.log('📦 Community entity created:', community.id);
            const communityData = community.toJSON();
            console.log('💾 Inserting community to database...');
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
            console.log('✅ Community inserted to database');
            // Add creator as admin member
            console.log('👑 Creating admin member record...');
            const adminMember = new CommunityMember_1.CommunityMember({
                communityId: community.id,
                userId,
                role: 'admin',
            });
            const memberData = adminMember.toJSON();
            await tx.communityMember.create({
                data: {
                    id: memberData.id,
                    communityId: memberData.communityId,
                    userId: memberData.userId,
                    role: memberData.role,
                    isAutoRenew: memberData.isAutoRenew,
                    subscriptionEndsAt: memberData.subscriptionEndsAt,
                    joinedAt: memberData.joinedAt,
                    isActive: memberData.isActive,
                },
            });
            console.log('✅ Admin member created');
            console.log('🎉 Transaction completed successfully!');
            return community;
        });
    }
};
exports.CreateCommunityUseCase = CreateCommunityUseCase;
exports.CreateCommunityUseCase = CreateCommunityUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IStorageService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [Object, Object, client_1.PrismaClient])
], CreateCommunityUseCase);
//# sourceMappingURL=CreateCommunityUseCase.js.map