"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const types_1 = require("./types");
const Database_1 = require("../database/Database");
const RedisService_1 = require("../services/RedisService");
const UserRepository_1 = require("../database/repositories/UserRepository");
const RedisOTPRepository_1 = require("../database/repositories/RedisOTPRepository");
const PasswordService_1 = require("../services/PasswordService");
const JWTService_1 = require("../services/JWTService");
const OTPService_1 = require("../services/OTPService");
const EmailService_1 = require("../services/EmailService");
const PendingRegistrationService_1 = require("../services/PendingRegistrationService");
const RegisterUseCase_1 = require("../../application/useCases/auth/RegisterUseCase");
const LoginUseCase_1 = require("../../application/useCases/auth/LoginUseCase");
const VerifyOtpUseCase_1 = require("../../application/useCases/auth/VerifyOtpUseCase");
const ResendOtpUseCase_1 = require("../../application/useCases/auth/ResendOtpUseCase");
const AdminLoginUseCase_1 = require("../../application/useCases/auth/AdminLoginUseCase");
const GoogleAuthUseCase_1 = require("../../application/useCases/auth/GoogleAuthUseCase");
const ForgotPasswordUseCase_1 = require("../../application/useCases/auth/ForgotPasswordUseCase");
const VerifyForgotPasswordOtpUseCase_1 = require("../../application/useCases/auth/VerifyForgotPasswordOtpUseCase");
const ResetPasswordUseCase_1 = require("../../application/useCases/auth/ResetPasswordUseCase");
const PassportService_1 = require("../services/PassportService");
const ListUsersUseCase_1 = require("../../application/useCases/admin/ListUsersUseCase");
const SuspendUserUseCase_1 = require("../../application/useCases/admin/SuspendUserUseCase");
const UnsuspendUserUseCase_1 = require("../../application/useCases/admin/UnsuspendUserUseCase");
const GetUserProfileUseCase_1 = require("../../application/useCases/user/GetUserProfileUseCase");
const UpdateUserProfileUseCase_1 = require("../../application/useCases/user/UpdateUserProfileUseCase");
const PrismaSubscriptionPlanRepository_1 = require("../database/repositories/PrismaSubscriptionPlanRepository");
const ListSubscriptionPlansUseCase_1 = require("../../application/useCases/subscription/ListSubscriptionPlansUseCase");
const ListPublicSubscriptionPlansUseCase_1 = require("../../application/useCases/subscription/ListPublicSubscriptionPlansUseCase");
const GetSubscriptionStatsUseCase_1 = require("../../application/useCases/subscription/GetSubscriptionStatsUseCase");
const CreateSubscriptionPlanUseCase_1 = require("../../application/useCases/subscription/CreateSubscriptionPlanUseCase");
const UpdateSubscriptionPlanUseCase_1 = require("../../application/useCases/subscription/UpdateSubscriptionPlanUseCase");
const DeleteSubscriptionPlanUseCase_1 = require("../../application/useCases/subscription/DeleteSubscriptionPlanUseCase");
const AuthController_1 = require("../../presentation/controllers/auth/AuthController");
const AdminController_1 = require("../../presentation/controllers/admin/AdminController");
const SubscriptionController_1 = require("../../presentation/controllers/subscription/SubscriptionController");
const PublicSubscriptionController_1 = require("../../presentation/controllers/subscription/PublicSubscriptionController");
const UserProfileController_1 = require("../../presentation/controllers/user/UserProfileController");
const authRoutes_1 = require("../../presentation/routes/auth/authRoutes");
const adminRoutes_1 = require("../../presentation/routes/admin/adminRoutes");
const subscriptionRoutes_1 = require("../../presentation/routes/subscription/subscriptionRoutes");
const publicSubscriptionRoutes_1 = require("../../presentation/routes/subscription/publicSubscriptionRoutes");
const userProfileRoutes_1 = require("../../presentation/routes/user/userProfileRoutes");
const server_1 = require("../../presentation/server");
const ResponseBuilder_1 = require("../../shared/http/ResponseBuilder");
const SkillRepository_1 = require("../database/repositories/SkillRepository");
const S3Service_1 = require("../services/S3Service");
const CreateSkillUseCase_1 = require("../../application/useCases/skill/CreateSkillUseCase");
const ListUserSkillsUseCase_1 = require("../../application/useCases/skill/ListUserSkillsUseCase");
const BrowseSkillsUseCase_1 = require("../../application/useCases/skill/BrowseSkillsUseCase");
const GetSkillDetailsUseCase_1 = require("../../application/useCases/skill/GetSkillDetailsUseCase");
const UpdateSkillUseCase_1 = require("../../application/useCases/skill/UpdateSkillUseCase");
const ToggleSkillBlockUseCase_1 = require("../../application/useCases/skill/ToggleSkillBlockUseCase");
const SkillController_1 = require("../../presentation/controllers/skill/SkillController");
const BrowseSkillsController_1 = require("../../presentation/controllers/BrowseSkillsController");
const SkillDetailsController_1 = require("../../presentation/controllers/skill/SkillDetailsController");
const skillRoutes_1 = require("../../presentation/routes/skill/skillRoutes");
const browseSkillsRoutes_1 = require("../../presentation/routes/skill/browseSkillsRoutes");
const SkillTemplateRepository_1 = require("../database/repositories/SkillTemplateRepository");
const CreateSkillTemplateUseCase_1 = require("../../application/useCases/skillTemplate/CreateSkillTemplateUseCase");
const ListSkillTemplatesUseCase_1 = require("../../application/useCases/skillTemplate/ListSkillTemplatesUseCase");
const UpdateSkillTemplateUseCase_1 = require("../../application/useCases/skillTemplate/UpdateSkillTemplateUseCase");
const DeleteSkillTemplateUseCase_1 = require("../../application/useCases/skillTemplate/DeleteSkillTemplateUseCase");
const ToggleSkillTemplateStatusUseCase_1 = require("../../application/useCases/skillTemplate/ToggleSkillTemplateStatusUseCase");
const SkillTemplateController_1 = require("../../presentation/controllers/skillTemplate/SkillTemplateController");
const skillTemplateRoutes_1 = require("../../presentation/routes/skillTemplate/skillTemplateRoutes");
const publicSkillTemplateRoutes_1 = require("../../presentation/routes/skillTemplate/publicSkillTemplateRoutes");
const TemplateQuestionRepository_1 = require("../database/repositories/TemplateQuestionRepository");
const CreateTemplateQuestionUseCase_1 = require("../../application/useCases/templateQuestion/CreateTemplateQuestionUseCase");
const ListTemplateQuestionsUseCase_1 = require("../../application/useCases/templateQuestion/ListTemplateQuestionsUseCase");
const UpdateTemplateQuestionUseCase_1 = require("../../application/useCases/templateQuestion/UpdateTemplateQuestionUseCase");
const DeleteTemplateQuestionUseCase_1 = require("../../application/useCases/templateQuestion/DeleteTemplateQuestionUseCase");
const BulkDeleteTemplateQuestionsUseCase_1 = require("../../application/useCases/templateQuestion/BulkDeleteTemplateQuestionsUseCase");
const TemplateQuestionController_1 = require("../../presentation/controllers/templateQuestion/TemplateQuestionController");
const templateQuestionRoutes_1 = require("../../presentation/routes/templateQuestion/templateQuestionRoutes");
const client_1 = require("@prisma/client");
const MCQRepository_1 = require("../database/repositories/MCQRepository");
const StartMCQTestUseCase_1 = require("../../application/useCases/mcq/StartMCQTestUseCase");
const SubmitMCQTestUseCase_1 = require("../../application/useCases/mcq/SubmitMCQTestUseCase");
const ListPendingSkillsUseCase_1 = require("../../application/useCases/admin/ListPendingSkillsUseCase");
const ApproveSkillUseCase_1 = require("../../application/useCases/admin/ApproveSkillUseCase");
const RejectSkillUseCase_1 = require("../../application/useCases/admin/RejectSkillUseCase");
const GetAllSkillsUseCase_1 = require("../../application/useCases/admin/GetAllSkillsUseCase");
const BlockSkillUseCase_1 = require("../../application/useCases/admin/BlockSkillUseCase");
const UnblockSkillUseCase_1 = require("../../application/useCases/admin/UnblockSkillUseCase");
const MCQTestController_1 = require("../../presentation/controllers/mcq/MCQTestController");
const AdminSkillController_1 = require("../../presentation/controllers/admin/AdminSkillController");
const mcqTestRoutes_1 = require("../../presentation/routes/mcq/mcqTestRoutes");
const adminSkillRoutes_1 = require("../../presentation/routes/admin/adminSkillRoutes");
const BookingRepository_1 = require("../database/repositories/BookingRepository");
const CreateBookingUseCase_1 = require("../../application/useCases/booking/CreateBookingUseCase");
const AcceptBookingUseCase_1 = require("../../application/useCases/booking/AcceptBookingUseCase");
const DeclineBookingUseCase_1 = require("../../application/useCases/booking/DeclineBookingUseCase");
const CancelBookingUseCase_1 = require("../../application/useCases/booking/CancelBookingUseCase");
const RescheduleBookingUseCase_1 = require("../../application/useCases/booking/RescheduleBookingUseCase");
const AcceptRescheduleUseCase_1 = require("../../application/useCases/booking/AcceptRescheduleUseCase");
const DeclineRescheduleUseCase_1 = require("../../application/useCases/booking/DeclineRescheduleUseCase");
const GetProviderBookingsUseCase_1 = require("../../application/useCases/booking/GetProviderBookingsUseCase");
const SessionManagementController_1 = require("../../presentation/controllers/SessionManagementController");
const BookingController_1 = require("../../presentation/controllers/BookingController");
const bookingRoutes_1 = require("../../presentation/routes/bookingRoutes");
const AdminUserDTOMapper_1 = require("../../application/mappers/AdminUserDTOMapper");
const UserDTOMapper_1 = require("../../application/mappers/UserDTOMapper");
const PendingSkillMapper_1 = require("../../application/mappers/PendingSkillMapper");
const SubscriptionPlanMapper_1 = require("../../application/mappers/SubscriptionPlanMapper");
const AuthResponseMapper_1 = require("../../presentation/controllers/auth/AuthResponseMapper");
const SkillMapper_1 = require("../../application/mappers/SkillMapper");
const BrowseSkillMapper_1 = require("../../application/mappers/BrowseSkillMapper");
const SkillDetailsMapper_1 = require("../../application/mappers/SkillDetailsMapper");
const BookingMapper_1 = require("../../application/mappers/BookingMapper");
const MCQImportJobRepository_1 = require("../database/repositories/MCQImportJobRepository");
const JobQueueService_1 = require("../services/JobQueueService");
const MCQImportJobProcessor_1 = require("../../application/useCases/mcq/MCQImportJobProcessor");
const StartMCQImportUseCase_1 = require("../../application/useCases/mcq/StartMCQImportUseCase");
const ListMCQImportJobsUseCase_1 = require("../../application/useCases/mcq/ListMCQImportJobsUseCase");
const DownloadMCQImportErrorsUseCase_1 = require("../../application/useCases/mcq/DownloadMCQImportErrorsUseCase");
const MCQImportController_1 = require("../../presentation/controllers/mcq/MCQImportController");
const MCQImportRoutes_1 = require("../../presentation/routes/mcq/MCQImportRoutes");
const di_1 = require("./di");
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return di_1.container; } });
const PrismaAvailabilityRepository_1 = require("../database/repositories/PrismaAvailabilityRepository");
const GetProviderAvailabilityUseCase_1 = require("../../application/useCases/availability/GetProviderAvailabilityUseCase");
const UpdateProviderAvailabilityUseCase_1 = require("../../application/useCases/availability/UpdateProviderAvailabilityUseCase");
const GetOccupiedSlotsUseCase_1 = require("../../application/useCases/availability/GetOccupiedSlotsUseCase");
const AvailabilityController_1 = require("../../presentation/controllers/availability/AvailabilityController");
const availabilityRoutes_1 = require("../../presentation/routes/availability/availabilityRoutes");
const CommunityRepository_1 = require("../database/repositories/CommunityRepository");
const CommunityMessageRepository_1 = require("../database/repositories/CommunityMessageRepository");
const WebSocketService_1 = require("../services/WebSocketService");
const CommunityMapper_1 = require("../../application/mappers/CommunityMapper");
const CommunityMessageMapper_1 = require("../../application/mappers/CommunityMessageMapper");
const CreateCommunityUseCase_1 = require("../../application/useCases/community/CreateCommunityUseCase");
const UpdateCommunityUseCase_1 = require("../../application/useCases/community/UpdateCommunityUseCase");
const GetCommunitiesUseCase_1 = require("../../application/useCases/community/GetCommunitiesUseCase");
const GetCommunityDetailsUseCase_1 = require("../../application/useCases/community/GetCommunityDetailsUseCase");
const JoinCommunityUseCase_1 = require("../../application/useCases/community/JoinCommunityUseCase");
const LeaveCommunityUseCase_1 = require("../../application/useCases/community/LeaveCommunityUseCase");
const SendMessageUseCase_1 = require("../../application/useCases/community/SendMessageUseCase");
const GetCommunityMessagesUseCase_1 = require("../../application/useCases/community/GetCommunityMessagesUseCase");
const PinMessageUseCase_1 = require("../../application/useCases/community/PinMessageUseCase");
const UnpinMessageUseCase_1 = require("../../application/useCases/community/UnpinMessageUseCase");
const DeleteMessageUseCase_1 = require("../../application/useCases/community/DeleteMessageUseCase");
const RemoveCommunityMemberUseCase_1 = require("../../application/useCases/community/RemoveCommunityMemberUseCase");
const CommunityController_1 = require("../../presentation/controllers/community/CommunityController");
const communityRoutes_1 = require("../../presentation/routes/community/communityRoutes");
// Mappers
di_1.container.bind(types_1.TYPES.IAdminUserDTOMapper).to(AdminUserDTOMapper_1.AdminUserDTOMapper);
di_1.container.bind(types_1.TYPES.IUserDTOMapper).to(UserDTOMapper_1.UserDTOMapper);
di_1.container.bind(types_1.TYPES.IPendingSkillMapper).to(PendingSkillMapper_1.PendingSkillMapper);
di_1.container.bind(types_1.TYPES.ISubscriptionPlanMapper).to(SubscriptionPlanMapper_1.SubscriptionPlanMapper);
di_1.container.bind(types_1.TYPES.IAuthResponseMapper).to(AuthResponseMapper_1.AuthResponseMapper);
di_1.container.bind(types_1.TYPES.ISkillMapper).to(SkillMapper_1.SkillMapper);
di_1.container.bind(types_1.TYPES.IBrowseSkillMapper).to(BrowseSkillMapper_1.BrowseSkillMapper);
di_1.container.bind(types_1.TYPES.ISkillDetailsMapper).to(SkillDetailsMapper_1.SkillDetailsMapper);
di_1.container.bind(types_1.TYPES.IBookingMapper).to(BookingMapper_1.BookingMapper);
// Prisma Client
const prisma = new client_1.PrismaClient();
di_1.container.bind(types_1.TYPES.PrismaClient).toConstantValue(prisma);
di_1.container.bind(types_1.TYPES.Database).toConstantValue(Database_1.Database.getInstance());
di_1.container.bind(types_1.TYPES.RedisService).toConstantValue(RedisService_1.RedisService.getInstance());
di_1.container.bind(types_1.TYPES.IUserRepository).to(UserRepository_1.UserRepository);
di_1.container.bind(types_1.TYPES.IOTPRepository).to(RedisOTPRepository_1.RedisOTPRepository);
di_1.container.bind(types_1.TYPES.IPasswordService).to(PasswordService_1.PasswordService);
di_1.container.bind(types_1.TYPES.IJWTService).to(JWTService_1.JWTService);
di_1.container.bind(types_1.TYPES.IOTPService).to(OTPService_1.OTPService);
di_1.container.bind(types_1.TYPES.IEmailService).to(EmailService_1.EmailService);
di_1.container.bind(types_1.TYPES.IPendingRegistrationService).to(PendingRegistrationService_1.PendingRegistrationService);
di_1.container.bind(types_1.TYPES.RegisterUseCase).to(RegisterUseCase_1.RegisterUseCase);
di_1.container.bind(types_1.TYPES.LoginUseCase).to(LoginUseCase_1.LoginUseCase);
di_1.container.bind(types_1.TYPES.VerifyOtpUseCase).to(VerifyOtpUseCase_1.VerifyOtpUseCase);
di_1.container.bind(types_1.TYPES.ResendOtpUseCase).to(ResendOtpUseCase_1.ResendOtpUseCase);
di_1.container.bind(types_1.TYPES.AdminLoginUseCase).to(AdminLoginUseCase_1.AdminLoginUseCase);
di_1.container.bind(types_1.TYPES.GoogleAuthUseCase).to(GoogleAuthUseCase_1.GoogleAuthUseCase);
di_1.container.bind(types_1.TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase_1.ForgotPasswordUseCase);
di_1.container.bind(types_1.TYPES.VerifyForgotPasswordOtpUseCase).to(VerifyForgotPasswordOtpUseCase_1.VerifyForgotPasswordOtpUseCase);
di_1.container.bind(types_1.TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase_1.ResetPasswordUseCase);
di_1.container.bind(types_1.TYPES.PassportService).to(PassportService_1.PassportService);
// Admin Use Cases
di_1.container.bind(types_1.TYPES.ListUsersUseCase).to(ListUsersUseCase_1.ListUsersUseCase);
di_1.container.bind(types_1.TYPES.SuspendUserUseCase).to(SuspendUserUseCase_1.SuspendUserUseCase);
di_1.container.bind(types_1.TYPES.UnsuspendUserUseCase).to(UnsuspendUserUseCase_1.UnsuspendUserUseCase);
di_1.container.bind(types_1.TYPES.GetUserProfileUseCase).to(GetUserProfileUseCase_1.GetUserProfileUseCase);
di_1.container.bind(types_1.TYPES.UpdateUserProfileUseCase).to(UpdateUserProfileUseCase_1.UpdateUserProfileUseCase);
// Subscription Repository
di_1.container.bind(types_1.TYPES.ISubscriptionPlanRepository).to(PrismaSubscriptionPlanRepository_1.PrismaSubscriptionPlanRepository);
// Subscription Use Cases
di_1.container.bind(types_1.TYPES.ListSubscriptionPlansUseCase).to(ListSubscriptionPlansUseCase_1.ListSubscriptionPlansUseCase);
di_1.container.bind(types_1.TYPES.ListPublicSubscriptionPlansUseCase).to(ListPublicSubscriptionPlansUseCase_1.ListPublicSubscriptionPlansUseCase);
di_1.container.bind(types_1.TYPES.GetSubscriptionStatsUseCase).to(GetSubscriptionStatsUseCase_1.GetSubscriptionStatsUseCase);
di_1.container.bind(types_1.TYPES.CreateSubscriptionPlanUseCase).to(CreateSubscriptionPlanUseCase_1.CreateSubscriptionPlanUseCase);
di_1.container.bind(types_1.TYPES.UpdateSubscriptionPlanUseCase).to(UpdateSubscriptionPlanUseCase_1.UpdateSubscriptionPlanUseCase);
di_1.container.bind(types_1.TYPES.DeleteSubscriptionPlanUseCase).to(DeleteSubscriptionPlanUseCase_1.DeleteSubscriptionPlanUseCase);
// Skill Repository and Services
di_1.container.bind(types_1.TYPES.ISkillRepository).to(SkillRepository_1.SkillRepository);
di_1.container.bind(types_1.TYPES.IS3Service).to(S3Service_1.S3Service);
// Skill Use Cases
di_1.container.bind(types_1.TYPES.CreateSkillUseCase).to(CreateSkillUseCase_1.CreateSkillUseCase);
di_1.container.bind(types_1.TYPES.ListUserSkillsUseCase).to(ListUserSkillsUseCase_1.ListUserSkillsUseCase);
di_1.container.bind(types_1.TYPES.BrowseSkillsUseCase).to(BrowseSkillsUseCase_1.BrowseSkillsUseCase);
di_1.container.bind(types_1.TYPES.GetSkillDetailsUseCase).to(GetSkillDetailsUseCase_1.GetSkillDetailsUseCase);
di_1.container.bind(types_1.TYPES.UpdateSkillUseCase).to(UpdateSkillUseCase_1.UpdateSkillUseCase);
di_1.container.bind(types_1.TYPES.ToggleSkillBlockUseCase).to(ToggleSkillBlockUseCase_1.ToggleSkillBlockUseCase);
// Skill Template Repository
di_1.container.bind(types_1.TYPES.ISkillTemplateRepository).to(SkillTemplateRepository_1.SkillTemplateRepository);
// Skill Template Use Cases
di_1.container.bind(types_1.TYPES.CreateSkillTemplateUseCase).to(CreateSkillTemplateUseCase_1.CreateSkillTemplateUseCase);
di_1.container.bind(types_1.TYPES.ListSkillTemplatesUseCase).to(ListSkillTemplatesUseCase_1.ListSkillTemplatesUseCase);
di_1.container.bind(types_1.TYPES.UpdateSkillTemplateUseCase).to(UpdateSkillTemplateUseCase_1.UpdateSkillTemplateUseCase);
di_1.container.bind(types_1.TYPES.DeleteSkillTemplateUseCase).to(DeleteSkillTemplateUseCase_1.DeleteSkillTemplateUseCase);
di_1.container.bind(types_1.TYPES.ToggleSkillTemplateStatusUseCase).to(ToggleSkillTemplateStatusUseCase_1.ToggleSkillTemplateStatusUseCase);
// Template Question Repository
di_1.container.bind(types_1.TYPES.ITemplateQuestionRepository).to(TemplateQuestionRepository_1.TemplateQuestionRepository);
// Template Question Use Cases
di_1.container.bind(types_1.TYPES.CreateTemplateQuestionUseCase).to(CreateTemplateQuestionUseCase_1.CreateTemplateQuestionUseCase);
di_1.container.bind(types_1.TYPES.ListTemplateQuestionsUseCase).to(ListTemplateQuestionsUseCase_1.ListTemplateQuestionsUseCase);
di_1.container.bind(types_1.TYPES.UpdateTemplateQuestionUseCase).to(UpdateTemplateQuestionUseCase_1.UpdateTemplateQuestionUseCase);
di_1.container.bind(types_1.TYPES.DeleteTemplateQuestionUseCase).to(DeleteTemplateQuestionUseCase_1.DeleteTemplateQuestionUseCase);
di_1.container.bind(types_1.TYPES.BulkDeleteTemplateQuestionsUseCase).to(BulkDeleteTemplateQuestionsUseCase_1.BulkDeleteTemplateQuestionsUseCase);
// MCQ Repository
di_1.container.bind(types_1.TYPES.IMCQRepository).to(MCQRepository_1.MCQRepository);
// MCQ Use Cases
di_1.container.bind(types_1.TYPES.StartMCQTestUseCase).to(StartMCQTestUseCase_1.StartMCQTestUseCase);
di_1.container.bind(types_1.TYPES.SubmitMCQTestUseCase).to(SubmitMCQTestUseCase_1.SubmitMCQTestUseCase);
// Admin Skill Management Use Cases
di_1.container.bind(types_1.TYPES.ListPendingSkillsUseCase).to(ListPendingSkillsUseCase_1.ListPendingSkillsUseCase);
di_1.container.bind(types_1.TYPES.ApproveSkillUseCase).to(ApproveSkillUseCase_1.ApproveSkillUseCase);
di_1.container.bind(types_1.TYPES.RejectSkillUseCase).to(RejectSkillUseCase_1.RejectSkillUseCase);
di_1.container.bind(types_1.TYPES.GetAllSkillsUseCase).to(GetAllSkillsUseCase_1.GetAllSkillsUseCase);
di_1.container.bind(types_1.TYPES.BlockSkillUseCase).to(BlockSkillUseCase_1.BlockSkillUseCase);
di_1.container.bind(types_1.TYPES.UnblockSkillUseCase).to(UnblockSkillUseCase_1.UnblockSkillUseCase);
// Session Management
di_1.container.bind(types_1.TYPES.IBookingRepository).to(BookingRepository_1.BookingRepository);
di_1.container.bind(types_1.TYPES.CreateBookingUseCase).to(CreateBookingUseCase_1.CreateBookingUseCase);
di_1.container.bind(types_1.TYPES.AcceptBookingUseCase).to(AcceptBookingUseCase_1.AcceptBookingUseCase);
di_1.container.bind(types_1.TYPES.DeclineBookingUseCase).to(DeclineBookingUseCase_1.DeclineBookingUseCase);
di_1.container.bind(types_1.TYPES.CancelBookingUseCase).to(CancelBookingUseCase_1.CancelBookingUseCase);
di_1.container.bind(types_1.TYPES.RescheduleBookingUseCase).to(RescheduleBookingUseCase_1.RescheduleBookingUseCase);
di_1.container.bind(types_1.TYPES.AcceptRescheduleUseCase).to(AcceptRescheduleUseCase_1.AcceptRescheduleUseCase);
di_1.container.bind(types_1.TYPES.DeclineRescheduleUseCase).to(DeclineRescheduleUseCase_1.DeclineRescheduleUseCase);
di_1.container.bind(types_1.TYPES.GetProviderBookingsUseCase).to(GetProviderBookingsUseCase_1.GetProviderBookingsUseCase);
// Controllers
di_1.container.bind(types_1.TYPES.AuthController).to(AuthController_1.AuthController);
di_1.container.bind(types_1.TYPES.AdminController).to(AdminController_1.AdminController);
di_1.container.bind(types_1.TYPES.SubscriptionController).to(SubscriptionController_1.SubscriptionController);
di_1.container.bind(types_1.TYPES.PublicSubscriptionController).to(PublicSubscriptionController_1.PublicSubscriptionController);
di_1.container.bind(types_1.TYPES.UserProfileController).to(UserProfileController_1.UserProfileController);
di_1.container.bind(types_1.TYPES.SkillController).to(SkillController_1.SkillController);
di_1.container.bind(types_1.TYPES.BrowseSkillsController).to(BrowseSkillsController_1.BrowseSkillsController);
di_1.container.bind(types_1.TYPES.SkillDetailsController).to(SkillDetailsController_1.SkillDetailsController);
di_1.container.bind(types_1.TYPES.SkillTemplateController).to(SkillTemplateController_1.SkillTemplateController);
di_1.container.bind(types_1.TYPES.TemplateQuestionController).to(TemplateQuestionController_1.TemplateQuestionController);
di_1.container.bind(types_1.TYPES.MCQTestController).to(MCQTestController_1.MCQTestController);
di_1.container.bind(types_1.TYPES.AdminSkillController).to(AdminSkillController_1.AdminSkillController);
di_1.container.bind(types_1.TYPES.SessionManagementController).to(SessionManagementController_1.SessionManagementController);
di_1.container.bind(types_1.TYPES.BookingController).to(BookingController_1.BookingController);
di_1.container.bind(types_1.TYPES.BookingRoutes).to(bookingRoutes_1.BookingRoutes);
// Routes
di_1.container.bind(types_1.TYPES.AuthRoutes).to(authRoutes_1.AuthRoutes);
di_1.container.bind(types_1.TYPES.AdminRoutes).to(adminRoutes_1.AdminRoutes);
di_1.container.bind(types_1.TYPES.SubscriptionRoutes).to(subscriptionRoutes_1.SubscriptionRoutes);
di_1.container.bind(types_1.TYPES.PublicSubscriptionRoutes).to(publicSubscriptionRoutes_1.PublicSubscriptionRoutes);
di_1.container.bind(types_1.TYPES.UserProfileRoutes).to(userProfileRoutes_1.UserProfileRoutes);
di_1.container.bind(types_1.TYPES.SkillRoutes).to(skillRoutes_1.SkillRoutes);
di_1.container.bind(types_1.TYPES.BrowseSkillsRoutes).to(browseSkillsRoutes_1.BrowseSkillsRoutes);
di_1.container.bind(types_1.TYPES.SkillTemplateRoutes).to(skillTemplateRoutes_1.SkillTemplateRoutes);
di_1.container.bind(types_1.TYPES.PublicSkillTemplateRoutes).to(publicSkillTemplateRoutes_1.PublicSkillTemplateRoutes);
di_1.container.bind(types_1.TYPES.TemplateQuestionRoutes).to(templateQuestionRoutes_1.TemplateQuestionRoutes);
di_1.container.bind(types_1.TYPES.MCQTestRoutes).to(mcqTestRoutes_1.MCQTestRoutes);
di_1.container.bind(types_1.TYPES.AdminSkillRoutes).to(adminSkillRoutes_1.AdminSkillRoutes);
// Response Builder
di_1.container.bind(types_1.TYPES.IResponseBuilder).to(ResponseBuilder_1.ResponseBuilder);
// App
di_1.container.bind(types_1.TYPES.App).to(server_1.App);
di_1.container.bind(types_1.TYPES.IMCQImportJobRepository).to(MCQImportJobRepository_1.MCQImportJobRepository); // Add new repo binding
// ...
// Services
di_1.container.bind(types_1.TYPES.IJobQueueService).to(JobQueueService_1.JobQueueService); // Add new service binding
// ...
// MCQ Import Use Cases & Processor
di_1.container.bind(types_1.TYPES.MCQImportJobProcessor).to(MCQImportJobProcessor_1.MCQImportJobProcessor);
di_1.container.bind(types_1.TYPES.StartMCQImportUseCase).to(StartMCQImportUseCase_1.StartMCQImportUseCase);
di_1.container.bind(types_1.TYPES.ListMCQImportJobsUseCase).to(ListMCQImportJobsUseCase_1.ListMCQImportJobsUseCase);
di_1.container.bind(types_1.TYPES.DownloadMCQImportErrorsUseCase).to(DownloadMCQImportErrorsUseCase_1.DownloadMCQImportErrorsUseCase);
// Controllers
di_1.container.bind(types_1.TYPES.MCQImportController).to(MCQImportController_1.MCQImportController); // Add new controller binding
// ...
// Routes
di_1.container.bind(types_1.TYPES.MCQImportRoutes).to(MCQImportRoutes_1.MCQImportRoutes);
// Add to src/infrastructure/di/container.ts
// Community Repositories
di_1.container.bind(types_1.TYPES.ICommunityRepository).to(CommunityRepository_1.CommunityRepository);
di_1.container.bind(types_1.TYPES.ICommunityMessageRepository).to(CommunityMessageRepository_1.CommunityMessageRepository);
// WebSocket Service
di_1.container.bind(types_1.TYPES.IWebSocketService).to(WebSocketService_1.WebSocketService).inSingletonScope();
// Community Mappers
di_1.container.bind(types_1.TYPES.ICommunityMapper).to(CommunityMapper_1.CommunityMapper);
di_1.container.bind(types_1.TYPES.ICommunityMessageMapper).to(CommunityMessageMapper_1.CommunityMessageMapper);
// Community Use Cases
di_1.container.bind(types_1.TYPES.CreateCommunityUseCase).to(CreateCommunityUseCase_1.CreateCommunityUseCase);
di_1.container.bind(types_1.TYPES.UpdateCommunityUseCase).to(UpdateCommunityUseCase_1.UpdateCommunityUseCase);
di_1.container.bind(types_1.TYPES.GetCommunitiesUseCase).to(GetCommunitiesUseCase_1.GetCommunitiesUseCase);
di_1.container.bind(types_1.TYPES.GetCommunityDetailsUseCase).to(GetCommunityDetailsUseCase_1.GetCommunityDetailsUseCase);
di_1.container.bind(types_1.TYPES.JoinCommunityUseCase).to(JoinCommunityUseCase_1.JoinCommunityUseCase);
di_1.container.bind(types_1.TYPES.LeaveCommunityUseCase).to(LeaveCommunityUseCase_1.LeaveCommunityUseCase);
di_1.container.bind(types_1.TYPES.SendMessageUseCase).to(SendMessageUseCase_1.SendMessageUseCase);
di_1.container.bind(types_1.TYPES.GetCommunityMessagesUseCase).to(GetCommunityMessagesUseCase_1.GetCommunityMessagesUseCase);
di_1.container.bind(types_1.TYPES.PinMessageUseCase).to(PinMessageUseCase_1.PinMessageUseCase);
di_1.container.bind(types_1.TYPES.UnpinMessageUseCase).to(UnpinMessageUseCase_1.UnpinMessageUseCase);
di_1.container.bind(types_1.TYPES.DeleteMessageUseCase).to(DeleteMessageUseCase_1.DeleteMessageUseCase);
di_1.container.bind(types_1.TYPES.RemoveCommunityMemberUseCase).to(RemoveCommunityMemberUseCase_1.RemoveCommunityMemberUseCase);
// Community Controller
di_1.container.bind(types_1.TYPES.CommunityController).to(CommunityController_1.CommunityController);
// Community Routes
di_1.container.bind(types_1.TYPES.CommunityRoutes).to(communityRoutes_1.CommunityRoutes);
di_1.container.bind(types_1.TYPES.IAvailabilityRepository).to(PrismaAvailabilityRepository_1.PrismaAvailabilityRepository);
di_1.container.bind(types_1.TYPES.GetProviderAvailabilityUseCase).to(GetProviderAvailabilityUseCase_1.GetProviderAvailabilityUseCase);
di_1.container.bind(types_1.TYPES.UpdateProviderAvailabilityUseCase).to(UpdateProviderAvailabilityUseCase_1.UpdateProviderAvailabilityUseCase);
di_1.container.bind(types_1.TYPES.GetOccupiedSlotsUseCase).to(GetOccupiedSlotsUseCase_1.GetOccupiedSlotsUseCase);
di_1.container.bind(types_1.TYPES.AvailabilityController).to(AvailabilityController_1.AvailabilityController);
di_1.container.bind(types_1.TYPES.AvailabilityRoutes).to(availabilityRoutes_1.AvailabilityRoutes);
//# sourceMappingURL=container.js.map