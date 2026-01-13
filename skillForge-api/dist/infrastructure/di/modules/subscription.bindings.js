"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindSubscriptionModule = void 0;
const types_1 = require("../types");
const ListSubscriptionPlansUseCase_1 = require("../../../application/useCases/subscription/ListSubscriptionPlansUseCase");
const ListPublicSubscriptionPlansUseCase_1 = require("../../../application/useCases/subscription/ListPublicSubscriptionPlansUseCase");
const GetSubscriptionStatsUseCase_1 = require("../../../application/useCases/subscription/GetSubscriptionStatsUseCase");
const CreateSubscriptionPlanUseCase_1 = require("../../../application/useCases/subscription/CreateSubscriptionPlanUseCase");
const UpdateSubscriptionPlanUseCase_1 = require("../../../application/useCases/subscription/UpdateSubscriptionPlanUseCase");
const DeleteSubscriptionPlanUseCase_1 = require("../../../application/useCases/subscription/DeleteSubscriptionPlanUseCase");
const AssignSubscriptionUseCase_1 = require("../../../application/useCases/subscription/AssignSubscriptionUseCase");
const ActivateSubscriptionUseCase_1 = require("../../../application/useCases/subscription/ActivateSubscriptionUseCase");
const GetUserSubscriptionUseCase_1 = require("../../../application/useCases/subscription/GetUserSubscriptionUseCase");
const CancelSubscriptionUseCase_1 = require("../../../application/useCases/subscription/CancelSubscriptionUseCase");
const ReactivateSubscriptionUseCase_1 = require("../../../application/useCases/subscription/ReactivateSubscriptionUseCase");
const CheckSubscriptionExpiryUseCase_1 = require("../../../application/useCases/subscription/CheckSubscriptionExpiryUseCase");
const TrackFeatureUsageUseCase_1 = require("../../../application/useCases/usage/TrackFeatureUsageUseCase");
const CreateFeatureUseCase_1 = require("../../../application/useCases/feature/CreateFeatureUseCase");
const ListFeaturesUseCase_1 = require("../../../application/useCases/feature/ListFeaturesUseCase");
const GetFeatureByIdUseCase_1 = require("../../../application/useCases/feature/GetFeatureByIdUseCase");
const UpdateFeatureUseCase_1 = require("../../../application/useCases/feature/UpdateFeatureUseCase");
const DeleteFeatureUseCase_1 = require("../../../application/useCases/feature/DeleteFeatureUseCase");
const SubscriptionController_1 = require("../../../presentation/controllers/subscription/SubscriptionController");
const PublicSubscriptionController_1 = require("../../../presentation/controllers/subscription/PublicSubscriptionController");
const UserSubscriptionController_1 = require("../../../presentation/controllers/subscription/UserSubscriptionController");
const subscriptionRoutes_1 = require("../../../presentation/routes/subscription/subscriptionRoutes");
const publicSubscriptionRoutes_1 = require("../../../presentation/routes/subscription/publicSubscriptionRoutes");
const userSubscriptionRoutes_1 = require("../../../presentation/routes/subscription/userSubscriptionRoutes");
const FeatureController_1 = require("../../../presentation/controllers/feature/FeatureController");
const featureRoutes_1 = require("../../../presentation/routes/feature/featureRoutes");
/**
 * Binds all subscription, feature, and usage-related use cases, controllers, and routes
 */
const bindSubscriptionModule = (container) => {
    // Subscription Plan Use Cases
    container.bind(types_1.TYPES.IListSubscriptionPlansUseCase).to(ListSubscriptionPlansUseCase_1.ListSubscriptionPlansUseCase);
    container.bind(types_1.TYPES.IListPublicSubscriptionPlansUseCase).to(ListPublicSubscriptionPlansUseCase_1.ListPublicSubscriptionPlansUseCase);
    container.bind(types_1.TYPES.IGetSubscriptionStatsUseCase).to(GetSubscriptionStatsUseCase_1.GetSubscriptionStatsUseCase);
    container.bind(types_1.TYPES.ICreateSubscriptionPlanUseCase).to(CreateSubscriptionPlanUseCase_1.CreateSubscriptionPlanUseCase);
    container.bind(types_1.TYPES.IUpdateSubscriptionPlanUseCase).to(UpdateSubscriptionPlanUseCase_1.UpdateSubscriptionPlanUseCase);
    container.bind(types_1.TYPES.IDeleteSubscriptionPlanUseCase).to(DeleteSubscriptionPlanUseCase_1.DeleteSubscriptionPlanUseCase);
    // User Subscription Use Cases
    container.bind(types_1.TYPES.IAssignSubscriptionUseCase).to(AssignSubscriptionUseCase_1.AssignSubscriptionUseCase);
    container.bind(types_1.TYPES.IActivateSubscriptionUseCase).to(ActivateSubscriptionUseCase_1.ActivateSubscriptionUseCase);
    container.bind(types_1.TYPES.IGetUserSubscriptionUseCase).to(GetUserSubscriptionUseCase_1.GetUserSubscriptionUseCase);
    container.bind(types_1.TYPES.ICancelSubscriptionUseCase).to(CancelSubscriptionUseCase_1.CancelSubscriptionUseCase);
    container.bind(types_1.TYPES.IReactivateSubscriptionUseCase).to(ReactivateSubscriptionUseCase_1.ReactivateSubscriptionUseCase);
    container.bind(types_1.TYPES.ICheckSubscriptionExpiryUseCase).to(CheckSubscriptionExpiryUseCase_1.CheckSubscriptionExpiryUseCase);
    // Feature Use Cases
    container.bind(types_1.TYPES.ICreateFeatureUseCase).to(CreateFeatureUseCase_1.CreateFeatureUseCase);
    container.bind(types_1.TYPES.IListFeaturesUseCase).to(ListFeaturesUseCase_1.ListFeaturesUseCase);
    container.bind(types_1.TYPES.IGetFeatureByIdUseCase).to(GetFeatureByIdUseCase_1.GetFeatureByIdUseCase);
    container.bind(types_1.TYPES.IUpdateFeatureUseCase).to(UpdateFeatureUseCase_1.UpdateFeatureUseCase);
    container.bind(types_1.TYPES.IDeleteFeatureUseCase).to(DeleteFeatureUseCase_1.DeleteFeatureUseCase);
    container.bind(types_1.TYPES.ITrackFeatureUsageUseCase).to(TrackFeatureUsageUseCase_1.TrackFeatureUsageUseCase);
    // Controllers & Routes
    container.bind(types_1.TYPES.SubscriptionController).to(SubscriptionController_1.SubscriptionController);
    container.bind(types_1.TYPES.PublicSubscriptionController).to(PublicSubscriptionController_1.PublicSubscriptionController);
    container.bind(types_1.TYPES.UserSubscriptionController).to(UserSubscriptionController_1.UserSubscriptionController);
    container.bind(types_1.TYPES.SubscriptionRoutes).to(subscriptionRoutes_1.SubscriptionRoutes);
    container.bind(types_1.TYPES.PublicSubscriptionRoutes).to(publicSubscriptionRoutes_1.PublicSubscriptionRoutes);
    container.bind(types_1.TYPES.UserSubscriptionRoutes).to(userSubscriptionRoutes_1.UserSubscriptionRoutes);
    container.bind(types_1.TYPES.FeatureController).to(FeatureController_1.FeatureController);
    container.bind(types_1.TYPES.FeatureRoutes).to(featureRoutes_1.FeatureRoutes);
};
exports.bindSubscriptionModule = bindSubscriptionModule;
//# sourceMappingURL=subscription.bindings.js.map