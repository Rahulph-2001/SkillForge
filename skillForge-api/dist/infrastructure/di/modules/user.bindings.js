"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindUserModule = void 0;
const types_1 = require("../types");
const GetUserProfileUseCase_1 = require("../../../application/useCases/user/GetUserProfileUseCase");
const GetUserByIdUseCase_1 = require("../../../application/useCases/user/GetUserByIdUseCase");
const UpdateUserProfileUseCase_1 = require("../../../application/useCases/user/UpdateUserProfileUseCase");
const GetProviderProfileUseCase_1 = require("../../../application/useCases/user/GetProviderProfileUseCase");
const GetProviderReviewsUseCase_1 = require("../../../application/useCases/user/GetProviderReviewsUseCase");
const UserProfileController_1 = require("../../../presentation/controllers/user/UserProfileController");
const userProfileRoutes_1 = require("../../../presentation/routes/user/userProfileRoutes");
/**
 * Binds all user profile-related use cases, controllers, and routes
 */
const bindUserModule = (container) => {
    // User Use Cases
    container.bind(types_1.TYPES.IGetUserProfileUseCase).to(GetUserProfileUseCase_1.GetUserProfileUseCase);
    container.bind(types_1.TYPES.IGetUserByIdUseCase).to(GetUserByIdUseCase_1.GetUserByIdUseCase);
    container.bind(types_1.TYPES.IUpdateUserProfileUseCase).to(UpdateUserProfileUseCase_1.UpdateUserProfileUseCase);
    container.bind(types_1.TYPES.IGetProviderProfileUseCase).to(GetProviderProfileUseCase_1.GetProviderProfileUseCase);
    container.bind(types_1.TYPES.IGetProviderReviewsUseCase).to(GetProviderReviewsUseCase_1.GetProviderReviewsUseCase);
    // Controllers & Routes
    container.bind(types_1.TYPES.UserProfileController).to(UserProfileController_1.UserProfileController);
    container.bind(types_1.TYPES.UserProfileRoutes).to(userProfileRoutes_1.UserProfileRoutes);
};
exports.bindUserModule = bindUserModule;
//# sourceMappingURL=user.bindings.js.map