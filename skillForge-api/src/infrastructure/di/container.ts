import 'reflect-metadata';
import { Container } from 'inversify';
import { container } from './di';
import { TYPES } from './types';
import { Database } from '../database/Database';
import { RedisService } from '../services/RedisService';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserRepository } from '../database/repositories/UserRepository';
import { IOTPRepository } from '../../domain/repositories/IOTPRepository';
import { RedisOTPRepository } from '../database/repositories/RedisOTPRepository';
import { IPasswordService } from '../../domain/services/IPasswordService';
import { PasswordService } from '../services/PasswordService';
import { IJWTService } from '../../domain/services/IJWTService';
import { JWTService } from '../services/JWTService';
import { IOTPService } from '../../domain/services/IOTPService';
import { OTPService } from '../services/OTPService';
import { IEmailService } from '../../domain/services/IEmailService';
import { EmailService } from '../services/EmailService';
import { IPendingRegistrationService } from '../../domain/services/IPendingRegistrationService';
import { PendingRegistrationService } from '../services/PendingRegistrationService';
import { RegisterUseCase } from '../../application/useCases/auth/RegisterUseCase';
import { LoginUseCase } from '../../application/useCases/auth/LoginUseCase';
import { VerifyOtpUseCase } from '../../application/useCases/auth/VerifyOtpUseCase';
import { ResendOtpUseCase } from '../../application/useCases/auth/ResendOtpUseCase';
import { AdminLoginUseCase } from '../../application/useCases/auth/AdminLoginUseCase';
import { GoogleAuthUseCase } from '../../application/useCases/auth/GoogleAuthUseCase';
import { ForgotPasswordUseCase } from '../../application/useCases/auth/ForgotPasswordUseCase';
import { VerifyForgotPasswordOtpUseCase } from '../../application/useCases/auth/VerifyForgotPasswordOtpUseCase';
import { ResetPasswordUseCase } from '../../application/useCases/auth/ResetPasswordUseCase';
import { PassportService } from '../services/PassportService';
import { ListUsersUseCase } from '../../application/useCases/admin/ListUsersUseCase';
import { SuspendUserUseCase } from '../../application/useCases/admin/SuspendUserUseCase';
import { UnsuspendUserUseCase } from '../../application/useCases/admin/UnsuspendUserUseCase';
import { GetUserProfileUseCase } from '../../application/useCases/user/GetUserProfileUseCase';
import { UpdateUserProfileUseCase } from '../../application/useCases/user/UpdateUserProfileUseCase';
import { ISubscriptionPlanRepository } from '../../domain/repositories/ISubscriptionPlanRepository';
import { IFeatureRepository } from '../../domain/repositories/IFeatureRepository';
import { PrismaSubscriptionPlanRepository } from '../database/repositories/SubscriptionPlanRepository';
import { PrismaFeatureRepository } from '../database/repositories/FeatureRepository';
import { ListSubscriptionPlansUseCase } from '../../application/useCases/subscription/ListSubscriptionPlansUseCase';
import { ListPublicSubscriptionPlansUseCase } from '../../application/useCases/subscription/ListPublicSubscriptionPlansUseCase';
import { GetSubscriptionStatsUseCase } from '../../application/useCases/subscription/GetSubscriptionStatsUseCase';
import { CreateSubscriptionPlanUseCase } from '../../application/useCases/subscription/CreateSubscriptionPlanUseCase';
import { UpdateSubscriptionPlanUseCase } from '../../application/useCases/subscription/UpdateSubscriptionPlanUseCase';
import { DeleteSubscriptionPlanUseCase } from '../../application/useCases/subscription/DeleteSubscriptionPlanUseCase';
import { AuthController } from '../../presentation/controllers/auth/AuthController';
import { AdminController } from '../../presentation/controllers/admin/AdminController';
import { SubscriptionController } from '../../presentation/controllers/subscription/SubscriptionController';
import { PublicSubscriptionController } from '../../presentation/controllers/subscription/PublicSubscriptionController';
import { UserProfileController } from '../../presentation/controllers/user/UserProfileController';
import { AuthRoutes } from '../../presentation/routes/auth/authRoutes';
import { AdminRoutes } from '../../presentation/routes/admin/adminRoutes';
import { SubscriptionRoutes } from '../../presentation/routes/subscription/subscriptionRoutes';
import { PublicSubscriptionRoutes } from '../../presentation/routes/subscription/publicSubscriptionRoutes';
import { UserProfileRoutes } from '../../presentation/routes/user/userProfileRoutes';
import { App } from '../../presentation/server';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
import { ResponseBuilder } from '../../shared/http/ResponseBuilder';
import { ISkillRepository } from '../../domain/repositories/ISkillRepository';
import { SkillRepository } from '../database/repositories/SkillRepository';
import { IStorageService } from '../../domain/services/IStorageService';
import { S3StorageService } from '../services/S3StorageService';
import { CreateSkillUseCase } from '../../application/useCases/skill/CreateSkillUseCase';
import { ListUserSkillsUseCase } from '../../application/useCases/skill/ListUserSkillsUseCase';
import { BrowseSkillsUseCase } from '../../application/useCases/skill/BrowseSkillsUseCase';
import { GetSkillDetailsUseCase } from '../../application/useCases/skill/GetSkillDetailsUseCase';
import { UpdateSkillUseCase, IUpdateSkillUseCase } from '../../application/useCases/skill/UpdateSkillUseCase';
import { ToggleSkillBlockUseCase, IToggleSkillBlockUseCase } from '../../application/useCases/skill/ToggleSkillBlockUseCase';
import { SkillController } from '../../presentation/controllers/skill/SkillController';
import { BrowseSkillsController } from '../../presentation/controllers/BrowseSkillsController';
import { SkillDetailsController } from '../../presentation/controllers/skill/SkillDetailsController';
import { SkillRoutes } from '../../presentation/routes/skill/skillRoutes';
import { BrowseSkillsRoutes } from '../../presentation/routes/skill/browseSkillsRoutes';
import { ISkillTemplateRepository } from '../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplateRepository } from '../database/repositories/SkillTemplateRepository';
import { CreateSkillTemplateUseCase } from '../../application/useCases/skillTemplate/CreateSkillTemplateUseCase';
import { ListSkillTemplatesUseCase } from '../../application/useCases/skillTemplate/ListSkillTemplatesUseCase';
import { UpdateSkillTemplateUseCase } from '../../application/useCases/skillTemplate/UpdateSkillTemplateUseCase';
import { DeleteSkillTemplateUseCase } from '../../application/useCases/skillTemplate/DeleteSkillTemplateUseCase';
import { ToggleSkillTemplateStatusUseCase } from '../../application/useCases/skillTemplate/ToggleSkillTemplateStatusUseCase';
import { SkillTemplateController } from '../../presentation/controllers/skillTemplate/SkillTemplateController';
import { SkillTemplateRoutes } from '../../presentation/routes/skillTemplate/skillTemplateRoutes';
import { PublicSkillTemplateRoutes } from '../../presentation/routes/skillTemplate/publicSkillTemplateRoutes';
import { ITemplateQuestionRepository } from '../../domain/repositories/ITemplateQuestionRepository';
import { TemplateQuestionRepository } from '../database/repositories/TemplateQuestionRepository';
import { CreateTemplateQuestionUseCase } from '../../application/useCases/templateQuestion/CreateTemplateQuestionUseCase';
import { ListTemplateQuestionsUseCase } from '../../application/useCases/templateQuestion/ListTemplateQuestionsUseCase';
import { UpdateTemplateQuestionUseCase } from '../../application/useCases/templateQuestion/UpdateTemplateQuestionUseCase';
import { DeleteTemplateQuestionUseCase } from '../../application/useCases/templateQuestion/DeleteTemplateQuestionUseCase';
import { BulkDeleteTemplateQuestionsUseCase } from '../../application/useCases/templateQuestion/BulkDeleteTemplateQuestionsUseCase';
import { TemplateQuestionController } from '../../presentation/controllers/templateQuestion/TemplateQuestionController';
import { TemplateQuestionRoutes } from '../../presentation/routes/templateQuestion/templateQuestionRoutes';
import { PrismaClient } from '@prisma/client';
import { IMCQRepository } from '../../domain/repositories/IMCQRepository';
import { MCQRepository } from '../database/repositories/MCQRepository';
import { StartMCQTestUseCase } from '../../application/useCases/mcq/StartMCQTestUseCase';
import { SubmitMCQTestUseCase } from '../../application/useCases/mcq/SubmitMCQTestUseCase';
import { ListPendingSkillsUseCase } from '../../application/useCases/admin/ListPendingSkillsUseCase';
import { ApproveSkillUseCase } from '../../application/useCases/admin/ApproveSkillUseCase';
import { RejectSkillUseCase } from '../../application/useCases/admin/RejectSkillUseCase';
import { GetAllSkillsUseCase } from '../../application/useCases/admin/GetAllSkillsUseCase';
import { BlockSkillUseCase } from '../../application/useCases/admin/BlockSkillUseCase';
import { UnblockSkillUseCase } from '../../application/useCases/admin/UnblockSkillUseCase';
import { MCQTestController } from '../../presentation/controllers/mcq/MCQTestController';
import { AdminSkillController } from '../../presentation/controllers/admin/AdminSkillController';
import { MCQTestRoutes } from '../../presentation/routes/mcq/mcqTestRoutes';
import { AdminSkillRoutes } from '../../presentation/routes/admin/adminSkillRoutes';
import { IBookingRepository } from '../../domain/repositories/IBookingRepository';
import { BookingRepository } from '../database/repositories/BookingRepository';
import { CreateBookingUseCase } from '../../application/useCases/booking/CreateBookingUseCase';
import { AcceptBookingUseCase } from '../../application/useCases/booking/AcceptBookingUseCase';
import { DeclineBookingUseCase } from '../../application/useCases/booking/DeclineBookingUseCase';
import { CancelBookingUseCase } from '../../application/useCases/booking/CancelBookingUseCase';
import { RescheduleBookingUseCase } from '../../application/useCases/booking/RescheduleBookingUseCase';
import { AcceptRescheduleUseCase } from '../../application/useCases/booking/AcceptRescheduleUseCase';
import { DeclineRescheduleUseCase } from '../../application/useCases/booking/DeclineRescheduleUseCase';
import { GetProviderBookingsUseCase } from '../../application/useCases/booking/GetProviderBookingsUseCase';
import { SessionManagementController } from '../../presentation/controllers/SessionManagementController';
import { BookingController } from '../../presentation/controllers/BookingController';
import { BookingRoutes } from '../../presentation/routes/bookingRoutes';

import { IAdminUserDTOMapper } from '../../application/mappers/interfaces/IAdminUserDTOMapper';
import { AdminUserDTOMapper } from '../../application/mappers/AdminUserDTOMapper';
import { IUserDTOMapper } from '../../application/mappers/interfaces/IUserDTOMapper';
import { UserDTOMapper } from '../../application/mappers/UserDTOMapper';
import { IPendingSkillMapper } from '../../application/mappers/interfaces/IPendingSkillMapper';
import { PendingSkillMapper } from '../../application/mappers/PendingSkillMapper';
import { ISubscriptionPlanMapper } from '../../application/mappers/interfaces/ISubscriptionPlanMapper';
import { SubscriptionPlanMapper } from '../../application/mappers/SubscriptionPlanMapper';
import { IAuthResponseMapper } from '../../presentation/controllers/auth/interfaces/IAuthResponseMapper';
import { AuthResponseMapper } from '../../presentation/controllers/auth/AuthResponseMapper';
import { ISkillMapper } from '../../application/mappers/interfaces/ISkillMapper';
import { SkillMapper } from '../../application/mappers/SkillMapper';
import { IBrowseSkillMapper } from '../../application/mappers/interfaces/IBrowseSkillMapper';
import { BrowseSkillMapper } from '../../application/mappers/BrowseSkillMapper';
import { ISkillDetailsMapper } from '../../application/mappers/interfaces/ISkillDetailsMapper';
import { SkillDetailsMapper } from '../../application/mappers/SkillDetailsMapper';
import { IBookingMapper } from '../../application/mappers/interfaces/IBookingMapper';
import { BookingMapper } from '../../application/mappers/BookingMapper';

import { IMCQImportJobRepository } from '../../domain/repositories/IMCQImportJobRepository';
import { MCQImportJobRepository } from '../database/repositories/MCQImportJobRepository';
import { IJobQueueService } from '../../domain/services/IJobQueueService';
import { JobQueueService } from '../services/JobQueueService';
import { MCQImportJobProcessor } from '../../application/useCases/mcq/MCQImportJobProcessor';
import { StartMCQImportUseCase } from '../../application/useCases/mcq/StartMCQImportUseCase';
import { ICheckSubscriptionExpiryUseCase } from '../../application/useCases/subscription/CheckSubscriptionExpiryUseCase';
import { CheckSubscriptionExpiryUseCase } from '../../application/useCases/subscription/CheckSubscriptionExpiryUseCase';

// ... (existing imports)

import { ListMCQImportJobsUseCase } from '../../application/useCases/mcq/ListMCQImportJobsUseCase';
import { DownloadMCQImportErrorsUseCase } from '../../application/useCases/mcq/DownloadMCQImportErrorsUseCase';
import { MCQImportController } from '../../presentation/controllers/mcq/MCQImportController';
import { MCQImportRoutes } from '../../presentation/routes/mcq/MCQImportRoutes';
export { container };



// Availability
import { IAvailabilityRepository } from '../../domain/repositories/IAvailabilityRepository';
import { PrismaAvailabilityRepository } from '../database/repositories/AvailabilityRepository';
import { GetProviderAvailabilityUseCase } from '../../application/useCases/availability/GetProviderAvailabilityUseCase';
import { UpdateProviderAvailabilityUseCase } from '../../application/useCases/availability/UpdateProviderAvailabilityUseCase';
import { GetOccupiedSlotsUseCase } from '../../application/useCases/availability/GetOccupiedSlotsUseCase';
import { AvailabilityController } from '../../presentation/controllers/availability/AvailabilityController';
import { AvailabilityRoutes } from '../../presentation/routes/availability/availabilityRoutes';

// Community
import { ICommunityRepository } from '../../domain/repositories/ICommunityRepository';
import { CommunityRepository } from '../database/repositories/CommunityRepository';
import { ICommunityMessageRepository } from '../../domain/repositories/ICommunityMessageRepository';
import { CommunityMessageRepository } from '../database/repositories/CommunityMessageRepository';
import { IWebSocketService } from '../../domain/services/IWebSocketService';
import { WebSocketService } from '../services/WebSocketService';
import { ICommunityMapper } from '../../application/mappers/interfaces/ICommunityMapper';
import { CommunityMapper } from '../../application/mappers/CommunityMapper';
import { ICommunityMessageMapper } from '../../application/mappers/interfaces/ICommunityMessageMapper';
import { CommunityMessageMapper } from '../../application/mappers/CommunityMessageMapper';
import { ICreateCommunityUseCase, CreateCommunityUseCase } from '../../application/useCases/community/CreateCommunityUseCase';
import { IUpdateCommunityUseCase, UpdateCommunityUseCase } from '../../application/useCases/community/UpdateCommunityUseCase';
import { IGetCommunitiesUseCase, GetCommunitiesUseCase } from '../../application/useCases/community/GetCommunitiesUseCase';
import { IGetCommunityDetailsUseCase, GetCommunityDetailsUseCase } from '../../application/useCases/community/GetCommunityDetailsUseCase';
import { IJoinCommunityUseCase, JoinCommunityUseCase } from '../../application/useCases/community/JoinCommunityUseCase';
import { ILeaveCommunityUseCase, LeaveCommunityUseCase } from '../../application/useCases/community/LeaveCommunityUseCase';
import { ISendMessageUseCase, SendMessageUseCase } from '../../application/useCases/community/SendMessageUseCase';
import { IGetCommunityMessagesUseCase, GetCommunityMessagesUseCase } from '../../application/useCases/community/GetCommunityMessagesUseCase';
import { IPinMessageUseCase, PinMessageUseCase } from '../../application/useCases/community/PinMessageUseCase';
import { IUnpinMessageUseCase, UnpinMessageUseCase } from '../../application/useCases/community/UnpinMessageUseCase';
import { IDeleteMessageUseCase, DeleteMessageUseCase } from '../../application/useCases/community/DeleteMessageUseCase';
import { IRemoveCommunityMemberUseCase, RemoveCommunityMemberUseCase } from '../../application/useCases/community/RemoveCommunityMemberUseCase';
import { IAddReactionUseCase, AddReactionUseCase } from '../../application/useCases/community/AddReactionUseCase';
import { IRemoveReactionUseCase, RemoveReactionUseCase } from '../../application/useCases/community/RemoveReactionUseCase';
import { IMessageReactionRepository } from '../../domain/repositories/IMessageReactionRepository';
import { MessageReactionRepository } from '../database/repositories/MessageReactionRepository';
import { CommunityController } from '../../presentation/controllers/community/CommunityController';
import { CommunityRoutes } from '../../presentation/routes/community/communityRoutes';

// Industrial Subscription System
import { IUserSubscriptionRepository } from '../../domain/repositories/IUserSubscriptionRepository';
import { PrismaUserSubscriptionRepository } from '../database/repositories/UserSubscriptionRepository';
import { IUsageRecordRepository } from '../../domain/repositories/IUsageRecordRepository';
import { PrismaUsageRecordRepository } from '../database/repositories/UsageRecordRepository';
import { CreateFeatureUseCase } from '../../application/useCases/feature/CreateFeatureUseCase';
import { AssignSubscriptionUseCase } from '../../application/useCases/subscription/AssignSubscriptionUseCase';
import { TrackFeatureUsageUseCase } from '../../application/useCases/usage/TrackFeatureUsageUseCase';
import { ListFeaturesUseCase } from '../../application/useCases/feature/ListFeaturesUseCase';
import { GetFeatureByIdUseCase } from '../../application/useCases/feature/GetFeatureByIdUseCase';
import { UpdateFeatureUseCase } from '../../application/useCases/feature/UpdateFeatureUseCase';
import { DeleteFeatureUseCase } from '../../application/useCases/feature/DeleteFeatureUseCase';
import { FeatureController } from '../../presentation/controllers/feature/FeatureController';
import { FeatureRoutes } from '../../presentation/routes/feature/featureRoutes';

// Payment 

import { StripePaymentGateway } from '../services/StripePaymentGateway';
import { PrismaPaymentRepository } from '../database/repositories/PaymentRepository';
import { CreatePaymentIntentUseCase } from '../../application/useCases/payment/CreatePaymentIntentUseCase';
import { ConfirmPaymentUseCase } from '../../application/useCases/payment/ConfirmPaymentUseCase';
import { HandleWebhookUseCase } from '../../application/useCases/payment/HandleWebhookUseCase';
import { ActivateSubscriptionUseCase } from '../../application/useCases/subscription/ActivateSubscriptionUseCase';
import { CreditAdminWalletUseCase } from '../../application/useCases/admin/CreditAdminWalletUseCase';
import { PaymentController } from '../../presentation/controllers/payment/PaymentController';
import { PaymentRoutes } from '../../presentation/routes/payment/paymentRoutes';

// User Subscription
import { GetUserSubscriptionUseCase } from '../../application/useCases/subscription/GetUserSubscriptionUseCase';
import { CancelSubscriptionUseCase } from '../../application/useCases/subscription/CancelSubscriptionUseCase';
import { UserSubscriptionController } from '../../presentation/controllers/subscription/UserSubscriptionController';
import { UserSubscriptionRoutes } from '../../presentation/routes/subscription/userSubscriptionRoutes';
import { ReactivateSubscriptionUseCase } from '../../application/useCases/subscription/ReactivateSubscriptionUseCase';



// Mappers
container.bind<IAdminUserDTOMapper>(TYPES.IAdminUserDTOMapper).to(AdminUserDTOMapper);
container.bind<IUserDTOMapper>(TYPES.IUserDTOMapper).to(UserDTOMapper);
container.bind<IPendingSkillMapper>(TYPES.IPendingSkillMapper).to(PendingSkillMapper);
container.bind<ISubscriptionPlanMapper>(TYPES.ISubscriptionPlanMapper).to(SubscriptionPlanMapper);
container.bind<IAuthResponseMapper>(TYPES.IAuthResponseMapper).to(AuthResponseMapper);
container.bind<ISkillMapper>(TYPES.ISkillMapper).to(SkillMapper);
container.bind<IBrowseSkillMapper>(TYPES.IBrowseSkillMapper).to(BrowseSkillMapper);
container.bind<ISkillDetailsMapper>(TYPES.ISkillDetailsMapper).to(SkillDetailsMapper);
container.bind<IBookingMapper>(TYPES.IBookingMapper).to(BookingMapper);

// Prisma Client
const prisma = new PrismaClient();
container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);

container.bind<Database>(TYPES.Database).toConstantValue(Database.getInstance());
container.bind<RedisService>(TYPES.RedisService).toConstantValue(RedisService.getInstance());
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IOTPRepository>(TYPES.IOTPRepository).to(RedisOTPRepository);
container.bind<IPasswordService>(TYPES.IPasswordService).to(PasswordService);
container.bind<IJWTService>(TYPES.IJWTService).to(JWTService);
container.bind<IOTPService>(TYPES.IOTPService).to(OTPService);
container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
container.bind<IPendingRegistrationService>(TYPES.IPendingRegistrationService).to(PendingRegistrationService);
container.bind<RegisterUseCase>(TYPES.RegisterUseCase).to(RegisterUseCase);
container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase);
container.bind<VerifyOtpUseCase>(TYPES.VerifyOtpUseCase).to(VerifyOtpUseCase);
container.bind<ResendOtpUseCase>(TYPES.ResendOtpUseCase).to(ResendOtpUseCase);
container.bind<AdminLoginUseCase>(TYPES.AdminLoginUseCase).to(AdminLoginUseCase);
container.bind<GoogleAuthUseCase>(TYPES.GoogleAuthUseCase).to(GoogleAuthUseCase);
container.bind<ForgotPasswordUseCase>(TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase);
container.bind<VerifyForgotPasswordOtpUseCase>(TYPES.VerifyForgotPasswordOtpUseCase).to(VerifyForgotPasswordOtpUseCase);
container.bind<ResetPasswordUseCase>(TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase);
container.bind<PassportService>(TYPES.PassportService).to(PassportService);
// Admin Use Cases
container.bind<ListUsersUseCase>(TYPES.ListUsersUseCase).to(ListUsersUseCase);
container.bind<SuspendUserUseCase>(TYPES.SuspendUserUseCase).to(SuspendUserUseCase);
container.bind<UnsuspendUserUseCase>(TYPES.UnsuspendUserUseCase).to(UnsuspendUserUseCase);
container.bind<GetUserProfileUseCase>(TYPES.GetUserProfileUseCase).to(GetUserProfileUseCase);
container.bind<UpdateUserProfileUseCase>(TYPES.UpdateUserProfileUseCase).to(UpdateUserProfileUseCase);
// Subscription Repository
container.bind<ISubscriptionPlanRepository>(TYPES.ISubscriptionPlanRepository).to(PrismaSubscriptionPlanRepository);

// Industrial Subscription System Repositories
container.bind<IUserSubscriptionRepository>(TYPES.IUserSubscriptionRepository).to(PrismaUserSubscriptionRepository);
container.bind<IUsageRecordRepository>(TYPES.IUsageRecordRepository).to(PrismaUsageRecordRepository);

// Subscription Use Cases
container.bind<ListSubscriptionPlansUseCase>(TYPES.ListSubscriptionPlansUseCase).to(ListSubscriptionPlansUseCase);
container.bind<ListPublicSubscriptionPlansUseCase>(TYPES.ListPublicSubscriptionPlansUseCase).to(ListPublicSubscriptionPlansUseCase);
container.bind<GetSubscriptionStatsUseCase>(TYPES.GetSubscriptionStatsUseCase).to(GetSubscriptionStatsUseCase);
container.bind<CreateSubscriptionPlanUseCase>(TYPES.CreateSubscriptionPlanUseCase).to(CreateSubscriptionPlanUseCase);
container.bind<UpdateSubscriptionPlanUseCase>(TYPES.UpdateSubscriptionPlanUseCase).to(UpdateSubscriptionPlanUseCase);
container.bind<DeleteSubscriptionPlanUseCase>(TYPES.DeleteSubscriptionPlanUseCase).to(DeleteSubscriptionPlanUseCase);

// Industrial Subscription System Use Cases
container.bind<CreateFeatureUseCase>(TYPES.ICreateFeatureUseCase).to(CreateFeatureUseCase);
container.bind<AssignSubscriptionUseCase>(TYPES.IAssignSubscriptionUseCase).to(AssignSubscriptionUseCase);
container.bind<TrackFeatureUsageUseCase>(TYPES.ITrackFeatureUsageUseCase).to(TrackFeatureUsageUseCase);
container.bind<ListFeaturesUseCase>(TYPES.IListFeaturesUseCase).to(ListFeaturesUseCase);
container.bind<GetFeatureByIdUseCase>(TYPES.IGetFeatureByIdUseCase).to(GetFeatureByIdUseCase);
container.bind<UpdateFeatureUseCase>(TYPES.IUpdateFeatureUseCase).to(UpdateFeatureUseCase);
container.bind<DeleteFeatureUseCase>(TYPES.IDeleteFeatureUseCase).to(DeleteFeatureUseCase);

// Feature Repository
container.bind<IFeatureRepository>(TYPES.IFeatureRepository).to(PrismaFeatureRepository);

// Feature Controller
container.bind<FeatureController>(TYPES.FeatureController).to(FeatureController);

// Feature Routes
container.bind<FeatureRoutes>(TYPES.FeatureRoutes).to(FeatureRoutes);

// Skill Repository and Services
container.bind<ISkillRepository>(TYPES.ISkillRepository).to(SkillRepository);
container.bind<IStorageService>(TYPES.IStorageService).to(S3StorageService);
// Skill Use Cases
container.bind<CreateSkillUseCase>(TYPES.CreateSkillUseCase).to(CreateSkillUseCase);
container.bind<ListUserSkillsUseCase>(TYPES.ListUserSkillsUseCase).to(ListUserSkillsUseCase);
container.bind<BrowseSkillsUseCase>(TYPES.BrowseSkillsUseCase).to(BrowseSkillsUseCase);
container.bind<GetSkillDetailsUseCase>(TYPES.GetSkillDetailsUseCase).to(GetSkillDetailsUseCase);
container.bind<IUpdateSkillUseCase>(TYPES.UpdateSkillUseCase).to(UpdateSkillUseCase);
container.bind<IToggleSkillBlockUseCase>(TYPES.ToggleSkillBlockUseCase).to(ToggleSkillBlockUseCase);
// Skill Template Repository
container.bind<ISkillTemplateRepository>(TYPES.ISkillTemplateRepository).to(SkillTemplateRepository);
// Skill Template Use Cases
container.bind<CreateSkillTemplateUseCase>(TYPES.CreateSkillTemplateUseCase).to(CreateSkillTemplateUseCase);
container.bind<ListSkillTemplatesUseCase>(TYPES.ListSkillTemplatesUseCase).to(ListSkillTemplatesUseCase);
container.bind<UpdateSkillTemplateUseCase>(TYPES.UpdateSkillTemplateUseCase).to(UpdateSkillTemplateUseCase);
container.bind<DeleteSkillTemplateUseCase>(TYPES.DeleteSkillTemplateUseCase).to(DeleteSkillTemplateUseCase);
container.bind<ToggleSkillTemplateStatusUseCase>(TYPES.ToggleSkillTemplateStatusUseCase).to(ToggleSkillTemplateStatusUseCase);

// Template Question Repository
container.bind<ITemplateQuestionRepository>(TYPES.ITemplateQuestionRepository).to(TemplateQuestionRepository);
// Template Question Use Cases
container.bind<CreateTemplateQuestionUseCase>(TYPES.CreateTemplateQuestionUseCase).to(CreateTemplateQuestionUseCase);
container.bind<ListTemplateQuestionsUseCase>(TYPES.ListTemplateQuestionsUseCase).to(ListTemplateQuestionsUseCase);
container.bind<UpdateTemplateQuestionUseCase>(TYPES.UpdateTemplateQuestionUseCase).to(UpdateTemplateQuestionUseCase);
container.bind<DeleteTemplateQuestionUseCase>(TYPES.DeleteTemplateQuestionUseCase).to(DeleteTemplateQuestionUseCase);
container.bind<BulkDeleteTemplateQuestionsUseCase>(TYPES.BulkDeleteTemplateQuestionsUseCase).to(BulkDeleteTemplateQuestionsUseCase);

// MCQ Repository
container.bind<IMCQRepository>(TYPES.IMCQRepository).to(MCQRepository);
// MCQ Use Cases
container.bind<StartMCQTestUseCase>(TYPES.StartMCQTestUseCase).to(StartMCQTestUseCase);
container.bind<SubmitMCQTestUseCase>(TYPES.SubmitMCQTestUseCase).to(SubmitMCQTestUseCase);

// Admin Skill Management Use Cases
container.bind<ListPendingSkillsUseCase>(TYPES.ListPendingSkillsUseCase).to(ListPendingSkillsUseCase);
container.bind<ApproveSkillUseCase>(TYPES.ApproveSkillUseCase).to(ApproveSkillUseCase);
container.bind<RejectSkillUseCase>(TYPES.RejectSkillUseCase).to(RejectSkillUseCase);
container.bind<GetAllSkillsUseCase>(TYPES.GetAllSkillsUseCase).to(GetAllSkillsUseCase);
container.bind<BlockSkillUseCase>(TYPES.BlockSkillUseCase).to(BlockSkillUseCase);
container.bind<UnblockSkillUseCase>(TYPES.UnblockSkillUseCase).to(UnblockSkillUseCase);

// Session Management
container.bind<IBookingRepository>(TYPES.IBookingRepository).to(BookingRepository);
container.bind<CreateBookingUseCase>(TYPES.CreateBookingUseCase).to(CreateBookingUseCase);
container.bind<AcceptBookingUseCase>(TYPES.AcceptBookingUseCase).to(AcceptBookingUseCase);
container.bind<DeclineBookingUseCase>(TYPES.DeclineBookingUseCase).to(DeclineBookingUseCase);
container.bind<CancelBookingUseCase>(TYPES.CancelBookingUseCase).to(CancelBookingUseCase);
container.bind<RescheduleBookingUseCase>(TYPES.RescheduleBookingUseCase).to(RescheduleBookingUseCase);
container.bind<AcceptRescheduleUseCase>(TYPES.AcceptRescheduleUseCase).to(AcceptRescheduleUseCase);
container.bind<DeclineRescheduleUseCase>(TYPES.DeclineRescheduleUseCase).to(DeclineRescheduleUseCase);
container.bind<GetProviderBookingsUseCase>(TYPES.GetProviderBookingsUseCase).to(GetProviderBookingsUseCase);

// Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AdminController>(TYPES.AdminController).to(AdminController);
container.bind<SubscriptionController>(TYPES.SubscriptionController).to(SubscriptionController);
container.bind<PublicSubscriptionController>(TYPES.PublicSubscriptionController).to(PublicSubscriptionController);
container.bind<UserProfileController>(TYPES.UserProfileController).to(UserProfileController);
container.bind<SkillController>(TYPES.SkillController).to(SkillController);
container.bind<BrowseSkillsController>(TYPES.BrowseSkillsController).to(BrowseSkillsController);
container.bind<SkillDetailsController>(TYPES.SkillDetailsController).to(SkillDetailsController);
container.bind<SkillTemplateController>(TYPES.SkillTemplateController).to(SkillTemplateController);
container.bind<TemplateQuestionController>(TYPES.TemplateQuestionController).to(TemplateQuestionController);
container.bind<MCQTestController>(TYPES.MCQTestController).to(MCQTestController);
container.bind<AdminSkillController>(TYPES.AdminSkillController).to(AdminSkillController);
container.bind<SessionManagementController>(TYPES.SessionManagementController).to(SessionManagementController);
container.bind<BookingController>(TYPES.BookingController).to(BookingController);

container.bind<BookingRoutes>(TYPES.BookingRoutes).to(BookingRoutes);
// Routes
container.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes);
container.bind<AdminRoutes>(TYPES.AdminRoutes).to(AdminRoutes);
container.bind<SubscriptionRoutes>(TYPES.SubscriptionRoutes).to(SubscriptionRoutes);
container.bind<PublicSubscriptionRoutes>(TYPES.PublicSubscriptionRoutes).to(PublicSubscriptionRoutes);
container.bind<UserProfileRoutes>(TYPES.UserProfileRoutes).to(UserProfileRoutes);
container.bind<SkillRoutes>(TYPES.SkillRoutes).to(SkillRoutes);
container.bind<BrowseSkillsRoutes>(TYPES.BrowseSkillsRoutes).to(BrowseSkillsRoutes);
container.bind<SkillTemplateRoutes>(TYPES.SkillTemplateRoutes).to(SkillTemplateRoutes);
container.bind<PublicSkillTemplateRoutes>(TYPES.PublicSkillTemplateRoutes).to(PublicSkillTemplateRoutes);
container.bind<TemplateQuestionRoutes>(TYPES.TemplateQuestionRoutes).to(TemplateQuestionRoutes);
container.bind<MCQTestRoutes>(TYPES.MCQTestRoutes).to(MCQTestRoutes);
container.bind<AdminSkillRoutes>(TYPES.AdminSkillRoutes).to(AdminSkillRoutes);
// Response Builder
container.bind<IResponseBuilder>(TYPES.IResponseBuilder).to(ResponseBuilder);
// App
container.bind<App>(TYPES.App).to(App);



container.bind<IMCQImportJobRepository>(TYPES.IMCQImportJobRepository).to(MCQImportJobRepository); // Add new repo binding
// ...

// Services

container.bind<IJobQueueService>(TYPES.IJobQueueService).to(JobQueueService); // Add new service binding
// ...

// MCQ Import Use Cases & Processor
container.bind<MCQImportJobProcessor>(TYPES.MCQImportJobProcessor).to(MCQImportJobProcessor);
container.bind<StartMCQImportUseCase>(TYPES.StartMCQImportUseCase).to(StartMCQImportUseCase);
container.bind<ListMCQImportJobsUseCase>(TYPES.ListMCQImportJobsUseCase).to(ListMCQImportJobsUseCase);
container.bind<DownloadMCQImportErrorsUseCase>(TYPES.DownloadMCQImportErrorsUseCase).to(DownloadMCQImportErrorsUseCase);

// Controllers

container.bind<MCQImportController>(TYPES.MCQImportController).to(MCQImportController); // Add new controller binding
// ...

// Routes

container.bind<MCQImportRoutes>(TYPES.MCQImportRoutes).to(MCQImportRoutes);


// Add to src/infrastructure/di/container.ts

// Community Repositories
container.bind<ICommunityRepository>(TYPES.ICommunityRepository).to(CommunityRepository);
container.bind<ICommunityMessageRepository>(TYPES.ICommunityMessageRepository).to(CommunityMessageRepository);

// WebSocket Service
container.bind<IWebSocketService>(TYPES.IWebSocketService).to(WebSocketService).inSingletonScope();

// Payment 

container.bind(TYPES.IPaymentGateway).to(StripePaymentGateway).inSingletonScope();
container.bind(TYPES.IPaymentRepository).to(PrismaPaymentRepository).inSingletonScope();
container.bind(TYPES.ICreatePaymentIntentUseCase).to(CreatePaymentIntentUseCase);
container.bind(TYPES.IConfirmPaymentUseCase).to(ConfirmPaymentUseCase);
container.bind(TYPES.IHandleWebhookUseCase).to(HandleWebhookUseCase);
container.bind(TYPES.IActivateSubscriptionUseCase).to(ActivateSubscriptionUseCase);
container.bind(TYPES.ICreditAdminWalletUseCase).to(CreditAdminWalletUseCase);
container.bind(TYPES.PaymentController).to(PaymentController);
container.bind(TYPES.PaymentRoutes).to(PaymentRoutes);

// User Subscription
container.bind(TYPES.IGetUserSubscriptionUseCase).to(GetUserSubscriptionUseCase);
container.bind(TYPES.ICancelSubscriptionUseCase).to(CancelSubscriptionUseCase);
container.bind(TYPES.UserSubscriptionController).to(UserSubscriptionController);
container.bind(TYPES.UserSubscriptionRoutes).to(UserSubscriptionRoutes);
container.bind(TYPES.IReactivateSubscriptionUseCase).to(ReactivateSubscriptionUseCase);


// Community Mappers
container.bind<ICommunityMapper>(TYPES.ICommunityMapper).to(CommunityMapper);
container.bind<ICommunityMessageMapper>(TYPES.ICommunityMessageMapper).to(CommunityMessageMapper);

// Community Use Cases
container.bind<ICreateCommunityUseCase>(TYPES.CreateCommunityUseCase).to(CreateCommunityUseCase);
container.bind<IUpdateCommunityUseCase>(TYPES.UpdateCommunityUseCase).to(UpdateCommunityUseCase);
container.bind<IGetCommunitiesUseCase>(TYPES.GetCommunitiesUseCase).to(GetCommunitiesUseCase);
container.bind<IGetCommunityDetailsUseCase>(TYPES.GetCommunityDetailsUseCase).to(GetCommunityDetailsUseCase);
container.bind<IJoinCommunityUseCase>(TYPES.JoinCommunityUseCase).to(JoinCommunityUseCase);
container.bind<ILeaveCommunityUseCase>(TYPES.LeaveCommunityUseCase).to(LeaveCommunityUseCase);
container.bind<ISendMessageUseCase>(TYPES.SendMessageUseCase).to(SendMessageUseCase);
container.bind<IGetCommunityMessagesUseCase>(TYPES.GetCommunityMessagesUseCase).to(GetCommunityMessagesUseCase);
container.bind<IPinMessageUseCase>(TYPES.PinMessageUseCase).to(PinMessageUseCase);
container.bind<IUnpinMessageUseCase>(TYPES.UnpinMessageUseCase).to(UnpinMessageUseCase);
container.bind<IDeleteMessageUseCase>(TYPES.DeleteMessageUseCase).to(DeleteMessageUseCase);
container.bind<IRemoveCommunityMemberUseCase>(TYPES.RemoveCommunityMemberUseCase).to(RemoveCommunityMemberUseCase);
container.bind<IMessageReactionRepository>(TYPES.IMessageReactionRepository).to(MessageReactionRepository);
container.bind<IAddReactionUseCase>(TYPES.AddReactionUseCase).to(AddReactionUseCase);
container.bind<IRemoveReactionUseCase>(TYPES.RemoveReactionUseCase).to(RemoveReactionUseCase);

// Community Controller
container.bind<CommunityController>(TYPES.CommunityController).to(CommunityController);

// Community Routes
container.bind<CommunityRoutes>(TYPES.CommunityRoutes).to(CommunityRoutes);

container.bind<IAvailabilityRepository>(TYPES.IAvailabilityRepository).to(PrismaAvailabilityRepository);
container.bind<GetProviderAvailabilityUseCase>(TYPES.GetProviderAvailabilityUseCase).to(GetProviderAvailabilityUseCase);
container.bind<UpdateProviderAvailabilityUseCase>(TYPES.UpdateProviderAvailabilityUseCase).to(UpdateProviderAvailabilityUseCase);
container.bind<GetOccupiedSlotsUseCase>(TYPES.GetOccupiedSlotsUseCase).to(GetOccupiedSlotsUseCase);
container.bind<AvailabilityController>(TYPES.AvailabilityController).to(AvailabilityController);
container.bind<ICheckSubscriptionExpiryUseCase>(TYPES.ICheckSubscriptionExpiryUseCase).to(CheckSubscriptionExpiryUseCase);
container.bind<AvailabilityRoutes>(TYPES.AvailabilityRoutes).to(AvailabilityRoutes);