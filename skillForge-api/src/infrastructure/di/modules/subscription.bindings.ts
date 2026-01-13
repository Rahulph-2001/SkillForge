import { Container } from 'inversify';
import { TYPES } from '../types';
import { ListSubscriptionPlansUseCase } from '../../../application/useCases/subscription/ListSubscriptionPlansUseCase';
import { IListSubscriptionPlansUseCase } from '../../../application/useCases/subscription/interfaces/IListSubscriptionPlansUseCase';
import { ListPublicSubscriptionPlansUseCase } from '../../../application/useCases/subscription/ListPublicSubscriptionPlansUseCase';
import { IListPublicSubscriptionPlansUseCase } from '../../../application/useCases/subscription/interfaces/IListPublicSubscriptionPlansUseCase';
import { GetSubscriptionStatsUseCase } from '../../../application/useCases/subscription/GetSubscriptionStatsUseCase';
import { IGetSubscriptionStatsUseCase } from '../../../application/useCases/subscription/interfaces/IGetSubscriptionStatsUseCase';
import { CreateSubscriptionPlanUseCase } from '../../../application/useCases/subscription/CreateSubscriptionPlanUseCase';
import { ICreateSubscriptionPlanUseCase } from '../../../application/useCases/subscription/interfaces/ICreateSubscriptionPlanUseCase';
import { UpdateSubscriptionPlanUseCase } from '../../../application/useCases/subscription/UpdateSubscriptionPlanUseCase';
import { IUpdateSubscriptionPlanUseCase } from '../../../application/useCases/subscription/interfaces/IUpdateSubscriptionPlanUseCase';
import { DeleteSubscriptionPlanUseCase } from '../../../application/useCases/subscription/DeleteSubscriptionPlanUseCase';
import { IDeleteSubscriptionPlanUseCase } from '../../../application/useCases/subscription/interfaces/IDeleteSubscriptionPlanUseCase';
import { AssignSubscriptionUseCase } from '../../../application/useCases/subscription/AssignSubscriptionUseCase';
import { IAssignSubscriptionUseCase } from '../../../application/useCases/subscription/interfaces/IAssignSubscriptionUseCase';
import { ActivateSubscriptionUseCase } from '../../../application/useCases/subscription/ActivateSubscriptionUseCase';
import { IActivateSubscriptionUseCase } from '../../../application/useCases/subscription/interfaces/IActivateSubscriptionUseCase';
import { GetUserSubscriptionUseCase } from '../../../application/useCases/subscription/GetUserSubscriptionUseCase';
import { IGetUserSubscriptionUseCase } from '../../../application/useCases/subscription/interfaces/IGetUserSubscriptionUseCase';
import { CancelSubscriptionUseCase } from '../../../application/useCases/subscription/CancelSubscriptionUseCase';
import { ICancelSubscriptionUseCase } from '../../../application/useCases/subscription/interfaces/ICancelSubscriptionUseCase';
import { ReactivateSubscriptionUseCase } from '../../../application/useCases/subscription/ReactivateSubscriptionUseCase';
import { IReactivateSubscriptionUseCase } from '../../../application/useCases/subscription/interfaces/IReactivateSubscriptionUseCase';
import { CheckSubscriptionExpiryUseCase } from '../../../application/useCases/subscription/CheckSubscriptionExpiryUseCase';
import { ICheckSubscriptionExpiryUseCase } from '../../../application/useCases/subscription/interfaces/ICheckSubscriptionExpiryUseCase';
import { TrackFeatureUsageUseCase } from '../../../application/useCases/usage/TrackFeatureUsageUseCase';
import { ITrackFeatureUsageUseCase } from '../../../application/useCases/usage/interfaces/ITrackFeatureUsageUseCase';
import { CreateFeatureUseCase } from '../../../application/useCases/feature/CreateFeatureUseCase';
import { ICreateFeatureUseCase } from '../../../application/useCases/feature/interfaces/ICreateFeatureUseCase';
import { ListFeaturesUseCase } from '../../../application/useCases/feature/ListFeaturesUseCase';
import { IListFeaturesUseCase } from '../../../application/useCases/feature/interfaces/IListFeaturesUseCase';
import { GetFeatureByIdUseCase } from '../../../application/useCases/feature/GetFeatureByIdUseCase';
import { IGetFeatureByIdUseCase } from '../../../application/useCases/feature/interfaces/IGetFeatureByIdUseCase';
import { UpdateFeatureUseCase } from '../../../application/useCases/feature/UpdateFeatureUseCase';
import { IUpdateFeatureUseCase } from '../../../application/useCases/feature/interfaces/IUpdateFeatureUseCase';
import { DeleteFeatureUseCase } from '../../../application/useCases/feature/DeleteFeatureUseCase';
import { IDeleteFeatureUseCase } from '../../../application/useCases/feature/interfaces/IDeleteFeatureUseCase';
import { SubscriptionController } from '../../../presentation/controllers/subscription/SubscriptionController';
import { PublicSubscriptionController } from '../../../presentation/controllers/subscription/PublicSubscriptionController';
import { UserSubscriptionController } from '../../../presentation/controllers/subscription/UserSubscriptionController';
import { SubscriptionRoutes } from '../../../presentation/routes/subscription/subscriptionRoutes';
import { PublicSubscriptionRoutes } from '../../../presentation/routes/subscription/publicSubscriptionRoutes';
import { UserSubscriptionRoutes } from '../../../presentation/routes/subscription/userSubscriptionRoutes';
import { FeatureController } from '../../../presentation/controllers/feature/FeatureController';
import { FeatureRoutes } from '../../../presentation/routes/feature/featureRoutes';

/**
 * Binds all subscription, feature, and usage-related use cases, controllers, and routes
 */
export const bindSubscriptionModule = (container: Container): void => {
  // Subscription Plan Use Cases
  container.bind<IListSubscriptionPlansUseCase>(TYPES.IListSubscriptionPlansUseCase).to(ListSubscriptionPlansUseCase);
  container.bind<IListPublicSubscriptionPlansUseCase>(TYPES.IListPublicSubscriptionPlansUseCase).to(ListPublicSubscriptionPlansUseCase);
  container.bind<IGetSubscriptionStatsUseCase>(TYPES.IGetSubscriptionStatsUseCase).to(GetSubscriptionStatsUseCase);
  container.bind<ICreateSubscriptionPlanUseCase>(TYPES.ICreateSubscriptionPlanUseCase).to(CreateSubscriptionPlanUseCase);
  container.bind<IUpdateSubscriptionPlanUseCase>(TYPES.IUpdateSubscriptionPlanUseCase).to(UpdateSubscriptionPlanUseCase);
  container.bind<IDeleteSubscriptionPlanUseCase>(TYPES.IDeleteSubscriptionPlanUseCase).to(DeleteSubscriptionPlanUseCase);
  
  // User Subscription Use Cases
  container.bind<IAssignSubscriptionUseCase>(TYPES.IAssignSubscriptionUseCase).to(AssignSubscriptionUseCase);
  container.bind<IActivateSubscriptionUseCase>(TYPES.IActivateSubscriptionUseCase).to(ActivateSubscriptionUseCase);
  container.bind<IGetUserSubscriptionUseCase>(TYPES.IGetUserSubscriptionUseCase).to(GetUserSubscriptionUseCase);
  container.bind<ICancelSubscriptionUseCase>(TYPES.ICancelSubscriptionUseCase).to(CancelSubscriptionUseCase);
  container.bind<IReactivateSubscriptionUseCase>(TYPES.IReactivateSubscriptionUseCase).to(ReactivateSubscriptionUseCase);
  container.bind<ICheckSubscriptionExpiryUseCase>(TYPES.ICheckSubscriptionExpiryUseCase).to(CheckSubscriptionExpiryUseCase);
  
  // Feature Use Cases
  container.bind<ICreateFeatureUseCase>(TYPES.ICreateFeatureUseCase).to(CreateFeatureUseCase);
  container.bind<IListFeaturesUseCase>(TYPES.IListFeaturesUseCase).to(ListFeaturesUseCase);
  container.bind<IGetFeatureByIdUseCase>(TYPES.IGetFeatureByIdUseCase).to(GetFeatureByIdUseCase);
  container.bind<IUpdateFeatureUseCase>(TYPES.IUpdateFeatureUseCase).to(UpdateFeatureUseCase);
  container.bind<IDeleteFeatureUseCase>(TYPES.IDeleteFeatureUseCase).to(DeleteFeatureUseCase);
  container.bind<ITrackFeatureUsageUseCase>(TYPES.ITrackFeatureUsageUseCase).to(TrackFeatureUsageUseCase);
  
  // Controllers & Routes
  container.bind<SubscriptionController>(TYPES.SubscriptionController).to(SubscriptionController);
  container.bind<PublicSubscriptionController>(TYPES.PublicSubscriptionController).to(PublicSubscriptionController);
  container.bind<UserSubscriptionController>(TYPES.UserSubscriptionController).to(UserSubscriptionController);
  container.bind<SubscriptionRoutes>(TYPES.SubscriptionRoutes).to(SubscriptionRoutes);
  container.bind<PublicSubscriptionRoutes>(TYPES.PublicSubscriptionRoutes).to(PublicSubscriptionRoutes);
  container.bind<UserSubscriptionRoutes>(TYPES.UserSubscriptionRoutes).to(UserSubscriptionRoutes);
  container.bind<FeatureController>(TYPES.FeatureController).to(FeatureController);
  container.bind<FeatureRoutes>(TYPES.FeatureRoutes).to(FeatureRoutes);
};

