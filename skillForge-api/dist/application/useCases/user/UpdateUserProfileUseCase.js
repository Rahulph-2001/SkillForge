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
exports.UpdateUserProfileUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const Database_1 = require("../../../infrastructure/database/Database");
const AppError_1 = require("../../../domain/errors/AppError");
let UpdateUserProfileUseCase = class UpdateUserProfileUseCase {
    constructor(database, s3Service) {
        this.prisma = database.getClient();
        this.s3Service = s3Service;
    }
    async execute(dto) {
        const { userId, name, bio, location, avatarFile } = dto;
        // Check if user exists
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new AppError_1.NotFoundError('User not found');
        }
        let avatarUrl = user.avatarUrl;
        // Upload avatar to S3 if provided
        if (avatarFile) {
            try {
                // Delete old avatar if exists and is from S3 (not Google/external URL)
                if (user.avatarUrl && user.avatarUrl.includes(process.env.AWS_S3_BUCKET_NAME || 'skillforge')) {
                    // Cast to string to satisfy type checker, though check ensures it's not null
                    await this.s3Service.deleteFile(user.avatarUrl);
                }
                // Upload new avatar
                const key = `avatars/${userId}/${Date.now()}-${avatarFile.originalname}`;
                // Cast avatarFile to any to avoid type mismatch with Buffer
                avatarUrl = await this.s3Service.uploadFile(avatarFile.buffer, key, avatarFile.mimetype);
            }
            catch (_error) {
                throw new AppError_1.InternalServerError('Failed to upload avatar image');
            }
        }
        // Update user profile
        const updateData = {
            ...(name && { name }),
            ...(bio !== undefined && { bio }),
            ...(location !== undefined && { location }),
            ...(avatarFile && { avatarUrl }), // Only update if new file was uploaded
        };
        const updatedUser = await this.prisma.user.update({
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
        return {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatarUrl: updatedUser.avatarUrl,
            bio: updatedUser.bio,
            location: updatedUser.location,
        };
    }
};
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase;
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IS3Service)),
    __metadata("design:paramtypes", [Database_1.Database, Object])
], UpdateUserProfileUseCase);
//# sourceMappingURL=UpdateUserProfileUseCase.js.map