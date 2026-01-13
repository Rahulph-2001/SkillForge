import { Container } from 'inversify';
import { TYPES } from '../types';
import { GetUserProfileUseCase } from '../../../application/useCases/user/GetUserProfileUseCase';
import { IGetUserProfileUseCase } from '../../../application/useCases/user/interfaces/IGetUserProfileUseCase';
import { GetUserByIdUseCase } from '../../../application/useCases/user/GetUserByIdUseCase';
import { IGetUserByIdUseCase } from '../../../application/useCases/user/interfaces/IGetUserByIdUseCase';
import { UpdateUserProfileUseCase } from '../../../application/useCases/user/UpdateUserProfileUseCase';
import { IUpdateUserProfileUseCase } from '../../../application/useCases/user/interfaces/IUpdateUserProfileUseCase';
import { GetProviderProfileUseCase } from '../../../application/useCases/user/GetProviderProfileUseCase';
import { IGetProviderProfileUseCase } from '../../../application/useCases/user/interfaces/IGetProviderProfileUseCase';
import { GetProviderReviewsUseCase } from '../../../application/useCases/user/GetProviderReviewsUseCase';
import { IGetProviderReviewsUseCase } from '../../../application/useCases/user/interfaces/IGetProviderReviewsUseCase';
import { UserProfileController } from '../../../presentation/controllers/user/UserProfileController';
import { UserProfileRoutes } from '../../../presentation/routes/user/userProfileRoutes';

/**
 * Binds all user profile-related use cases, controllers, and routes
 */
export const bindUserModule = (container: Container): void => {
  // User Use Cases
  container.bind<IGetUserProfileUseCase>(TYPES.IGetUserProfileUseCase).to(GetUserProfileUseCase);
  container.bind<IGetUserByIdUseCase>(TYPES.IGetUserByIdUseCase).to(GetUserByIdUseCase);
  container.bind<IUpdateUserProfileUseCase>(TYPES.IUpdateUserProfileUseCase).to(UpdateUserProfileUseCase);
  container.bind<IGetProviderProfileUseCase>(TYPES.IGetProviderProfileUseCase).to(GetProviderProfileUseCase);
  container.bind<IGetProviderReviewsUseCase>(TYPES.IGetProviderReviewsUseCase).to(GetProviderReviewsUseCase);
  
  // Controllers & Routes
  container.bind<UserProfileController>(TYPES.UserProfileController).to(UserProfileController);
  container.bind<UserProfileRoutes>(TYPES.UserProfileRoutes).to(UserProfileRoutes);
};

