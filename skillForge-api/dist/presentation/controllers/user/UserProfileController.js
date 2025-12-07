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
const GetUserProfileUseCase_1 = require("../../../application/useCases/user/GetUserProfileUseCase");
const UpdateUserProfileUseCase_1 = require("../../../application/useCases/user/UpdateUserProfileUseCase");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
let UserProfileController = class UserProfileController {
    constructor(getUserProfileUseCase, updateUserProfileUseCase, responseBuilder) {
        this.getUserProfileUseCase = getUserProfileUseCase;
        this.updateUserProfileUseCase = updateUserProfileUseCase;
        this.responseBuilder = responseBuilder;
        this.getProfile = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const profile = await this.getUserProfileUseCase.execute(userId);
                const response = this.responseBuilder.success(profile, 'Profile retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
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
                const avatarFile = req.file;
                const updatedProfile = await this.updateUserProfileUseCase.execute({
                    userId,
                    name,
                    bio,
                    location,
                    avatarFile,
                });
                const response = this.responseBuilder.success(updatedProfile, 'Profile updated successfully', HttpStatusCode_1.HttpStatusCode.OK);
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
    __param(0, (0, inversify_1.inject)(types_1.TYPES.GetUserProfileUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UpdateUserProfileUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [GetUserProfileUseCase_1.GetUserProfileUseCase,
        UpdateUserProfileUseCase_1.UpdateUserProfileUseCase, Object])
], UserProfileController);
//# sourceMappingURL=UserProfileController.js.map