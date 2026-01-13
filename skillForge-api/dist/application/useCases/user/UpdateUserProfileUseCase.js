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
const AppError_1 = require("../../../domain/errors/AppError");
let UpdateUserProfileUseCase = class UpdateUserProfileUseCase {
    constructor(userRepository, storageService) {
        this.userRepository = userRepository;
        this.storageService = storageService;
    }
    async execute(dto) {
        const { userId, name, bio, location, avatarFile } = dto;
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError_1.NotFoundError('User not found');
        }
        let avatarUrl = user.avatarUrl;
        if (avatarFile) {
            try {
                const key = `avatars/${userId}/${Date.now()}-${avatarFile.originalname}`;
                avatarUrl = await this.storageService.uploadFile(avatarFile.buffer, key, avatarFile.mimetype);
            }
            catch (_error) {
                throw new AppError_1.InternalServerError('Failed to upload avatar image');
            }
        }
        // Update user entity
        user.updateProfile({
            name,
            bio,
            location,
            avatarUrl,
        });
        const updatedUser = await this.userRepository.update(user);
        return {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email.value,
            avatarUrl: updatedUser.avatarUrl,
            bio: updatedUser.bio,
            location: updatedUser.location,
        };
    }
};
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase;
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IStorageService)),
    __metadata("design:paramtypes", [Object, Object])
], UpdateUserProfileUseCase);
//# sourceMappingURL=UpdateUserProfileUseCase.js.map