"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
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
const BookingRepository_1 = require("../repositories/BookingRepository");
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
exports.container = new inversify_1.Container();
// Mappers
exports.container.bind(types_1.TYPES.IAdminUserDTOMapper).to(AdminUserDTOMapper_1.AdminUserDTOMapper);
exports.container.bind(types_1.TYPES.IUserDTOMapper).to(UserDTOMapper_1.UserDTOMapper);
exports.container.bind(types_1.TYPES.IPendingSkillMapper).to(PendingSkillMapper_1.PendingSkillMapper);
exports.container.bind(types_1.TYPES.ISubscriptionPlanMapper).to(SubscriptionPlanMapper_1.SubscriptionPlanMapper);
exports.container.bind(types_1.TYPES.IAuthResponseMapper).to(AuthResponseMapper_1.AuthResponseMapper);
exports.container.bind(types_1.TYPES.ISkillMapper).to(SkillMapper_1.SkillMapper);
exports.container.bind(types_1.TYPES.IBrowseSkillMapper).to(BrowseSkillMapper_1.BrowseSkillMapper);
exports.container.bind(types_1.TYPES.ISkillDetailsMapper).to(SkillDetailsMapper_1.SkillDetailsMapper);
exports.container.bind(types_1.TYPES.IBookingMapper).to(BookingMapper_1.BookingMapper);
// Prisma Client
const prisma = new client_1.PrismaClient();
exports.container.bind(types_1.TYPES.PrismaClient).toConstantValue(prisma);
exports.container.bind(types_1.TYPES.Database).toConstantValue(Database_1.Database.getInstance());
exports.container.bind(types_1.TYPES.RedisService).toConstantValue(RedisService_1.RedisService.getInstance());
exports.container.bind(types_1.TYPES.IUserRepository).to(UserRepository_1.UserRepository);
exports.container.bind(types_1.TYPES.IOTPRepository).to(RedisOTPRepository_1.RedisOTPRepository);
exports.container.bind(types_1.TYPES.IPasswordService).to(PasswordService_1.PasswordService);
exports.container.bind(types_1.TYPES.IJWTService).to(JWTService_1.JWTService);
exports.container.bind(types_1.TYPES.IOTPService).to(OTPService_1.OTPService);
exports.container.bind(types_1.TYPES.IEmailService).to(EmailService_1.EmailService);
exports.container.bind(types_1.TYPES.IPendingRegistrationService).to(PendingRegistrationService_1.PendingRegistrationService);
exports.container.bind(types_1.TYPES.RegisterUseCase).to(RegisterUseCase_1.RegisterUseCase);
exports.container.bind(types_1.TYPES.LoginUseCase).to(LoginUseCase_1.LoginUseCase);
exports.container.bind(types_1.TYPES.VerifyOtpUseCase).to(VerifyOtpUseCase_1.VerifyOtpUseCase);
exports.container.bind(types_1.TYPES.ResendOtpUseCase).to(ResendOtpUseCase_1.ResendOtpUseCase);
exports.container.bind(types_1.TYPES.AdminLoginUseCase).to(AdminLoginUseCase_1.AdminLoginUseCase);
exports.container.bind(types_1.TYPES.GoogleAuthUseCase).to(GoogleAuthUseCase_1.GoogleAuthUseCase);
exports.container.bind(types_1.TYPES.ForgotPasswordUseCase).to(ForgotPasswordUseCase_1.ForgotPasswordUseCase);
exports.container.bind(types_1.TYPES.VerifyForgotPasswordOtpUseCase).to(VerifyForgotPasswordOtpUseCase_1.VerifyForgotPasswordOtpUseCase);
exports.container.bind(types_1.TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase_1.ResetPasswordUseCase);
exports.container.bind(types_1.TYPES.PassportService).to(PassportService_1.PassportService);
// Admin Use Cases
exports.container.bind(types_1.TYPES.ListUsersUseCase).to(ListUsersUseCase_1.ListUsersUseCase);
exports.container.bind(types_1.TYPES.SuspendUserUseCase).to(SuspendUserUseCase_1.SuspendUserUseCase);
exports.container.bind(types_1.TYPES.UnsuspendUserUseCase).to(UnsuspendUserUseCase_1.UnsuspendUserUseCase);
exports.container.bind(types_1.TYPES.GetUserProfileUseCase).to(GetUserProfileUseCase_1.GetUserProfileUseCase);
exports.container.bind(types_1.TYPES.UpdateUserProfileUseCase).to(UpdateUserProfileUseCase_1.UpdateUserProfileUseCase);
// Subscription Repository
exports.container.bind(types_1.TYPES.ISubscriptionPlanRepository).to(PrismaSubscriptionPlanRepository_1.PrismaSubscriptionPlanRepository);
// Subscription Use Cases
exports.container.bind(types_1.TYPES.ListSubscriptionPlansUseCase).to(ListSubscriptionPlansUseCase_1.ListSubscriptionPlansUseCase);
exports.container.bind(types_1.TYPES.ListPublicSubscriptionPlansUseCase).to(ListPublicSubscriptionPlansUseCase_1.ListPublicSubscriptionPlansUseCase);
exports.container.bind(types_1.TYPES.GetSubscriptionStatsUseCase).to(GetSubscriptionStatsUseCase_1.GetSubscriptionStatsUseCase);
exports.container.bind(types_1.TYPES.CreateSubscriptionPlanUseCase).to(CreateSubscriptionPlanUseCase_1.CreateSubscriptionPlanUseCase);
exports.container.bind(types_1.TYPES.UpdateSubscriptionPlanUseCase).to(UpdateSubscriptionPlanUseCase_1.UpdateSubscriptionPlanUseCase);
exports.container.bind(types_1.TYPES.DeleteSubscriptionPlanUseCase).to(DeleteSubscriptionPlanUseCase_1.DeleteSubscriptionPlanUseCase);
// Skill Repository and Services
exports.container.bind(types_1.TYPES.ISkillRepository).to(SkillRepository_1.SkillRepository);
exports.container.bind(types_1.TYPES.IS3Service).to(S3Service_1.S3Service);
// Skill Use Cases
exports.container.bind(types_1.TYPES.CreateSkillUseCase).to(CreateSkillUseCase_1.CreateSkillUseCase);
exports.container.bind(types_1.TYPES.ListUserSkillsUseCase).to(ListUserSkillsUseCase_1.ListUserSkillsUseCase);
exports.container.bind(types_1.TYPES.BrowseSkillsUseCase).to(BrowseSkillsUseCase_1.BrowseSkillsUseCase);
exports.container.bind(types_1.TYPES.GetSkillDetailsUseCase).to(GetSkillDetailsUseCase_1.GetSkillDetailsUseCase);
// Skill Template Repository
exports.container.bind(types_1.TYPES.ISkillTemplateRepository).to(SkillTemplateRepository_1.SkillTemplateRepository);
// Skill Template Use Cases
exports.container.bind(types_1.TYPES.CreateSkillTemplateUseCase).to(CreateSkillTemplateUseCase_1.CreateSkillTemplateUseCase);
exports.container.bind(types_1.TYPES.ListSkillTemplatesUseCase).to(ListSkillTemplatesUseCase_1.ListSkillTemplatesUseCase);
exports.container.bind(types_1.TYPES.UpdateSkillTemplateUseCase).to(UpdateSkillTemplateUseCase_1.UpdateSkillTemplateUseCase);
exports.container.bind(types_1.TYPES.DeleteSkillTemplateUseCase).to(DeleteSkillTemplateUseCase_1.DeleteSkillTemplateUseCase);
exports.container.bind(types_1.TYPES.ToggleSkillTemplateStatusUseCase).to(ToggleSkillTemplateStatusUseCase_1.ToggleSkillTemplateStatusUseCase);
// Template Question Repository
exports.container.bind(types_1.TYPES.ITemplateQuestionRepository).to(TemplateQuestionRepository_1.TemplateQuestionRepository);
// Template Question Use Cases
exports.container.bind(types_1.TYPES.CreateTemplateQuestionUseCase).to(CreateTemplateQuestionUseCase_1.CreateTemplateQuestionUseCase);
exports.container.bind(types_1.TYPES.ListTemplateQuestionsUseCase).to(ListTemplateQuestionsUseCase_1.ListTemplateQuestionsUseCase);
exports.container.bind(types_1.TYPES.UpdateTemplateQuestionUseCase).to(UpdateTemplateQuestionUseCase_1.UpdateTemplateQuestionUseCase);
exports.container.bind(types_1.TYPES.DeleteTemplateQuestionUseCase).to(DeleteTemplateQuestionUseCase_1.DeleteTemplateQuestionUseCase);
// MCQ Repository
exports.container.bind(types_1.TYPES.IMCQRepository).to(MCQRepository_1.MCQRepository);
// MCQ Use Cases
exports.container.bind(types_1.TYPES.StartMCQTestUseCase).to(StartMCQTestUseCase_1.StartMCQTestUseCase);
exports.container.bind(types_1.TYPES.SubmitMCQTestUseCase).to(SubmitMCQTestUseCase_1.SubmitMCQTestUseCase);
// Admin Skill Management Use Cases
exports.container.bind(types_1.TYPES.ListPendingSkillsUseCase).to(ListPendingSkillsUseCase_1.ListPendingSkillsUseCase);
exports.container.bind(types_1.TYPES.ApproveSkillUseCase).to(ApproveSkillUseCase_1.ApproveSkillUseCase);
exports.container.bind(types_1.TYPES.RejectSkillUseCase).to(RejectSkillUseCase_1.RejectSkillUseCase);
exports.container.bind(types_1.TYPES.GetAllSkillsUseCase).to(GetAllSkillsUseCase_1.GetAllSkillsUseCase);
exports.container.bind(types_1.TYPES.BlockSkillUseCase).to(BlockSkillUseCase_1.BlockSkillUseCase);
exports.container.bind(types_1.TYPES.UnblockSkillUseCase).to(UnblockSkillUseCase_1.UnblockSkillUseCase);
// Session Management
exports.container.bind(types_1.TYPES.IBookingRepository).to(BookingRepository_1.BookingRepository);
exports.container.bind(types_1.TYPES.CreateBookingUseCase).to(CreateBookingUseCase_1.CreateBookingUseCase);
exports.container.bind(types_1.TYPES.AcceptBookingUseCase).to(AcceptBookingUseCase_1.AcceptBookingUseCase);
exports.container.bind(types_1.TYPES.DeclineBookingUseCase).to(DeclineBookingUseCase_1.DeclineBookingUseCase);
exports.container.bind(types_1.TYPES.CancelBookingUseCase).to(CancelBookingUseCase_1.CancelBookingUseCase);
exports.container.bind(types_1.TYPES.RescheduleBookingUseCase).to(RescheduleBookingUseCase_1.RescheduleBookingUseCase);
exports.container.bind(types_1.TYPES.AcceptRescheduleUseCase).to(AcceptRescheduleUseCase_1.AcceptRescheduleUseCase);
exports.container.bind(types_1.TYPES.DeclineRescheduleUseCase).to(DeclineRescheduleUseCase_1.DeclineRescheduleUseCase);
exports.container.bind(types_1.TYPES.GetProviderBookingsUseCase).to(GetProviderBookingsUseCase_1.GetProviderBookingsUseCase);
// Controllers
exports.container.bind(types_1.TYPES.AuthController).to(AuthController_1.AuthController);
exports.container.bind(types_1.TYPES.AdminController).to(AdminController_1.AdminController);
exports.container.bind(types_1.TYPES.SubscriptionController).to(SubscriptionController_1.SubscriptionController);
exports.container.bind(types_1.TYPES.PublicSubscriptionController).to(PublicSubscriptionController_1.PublicSubscriptionController);
exports.container.bind(types_1.TYPES.UserProfileController).to(UserProfileController_1.UserProfileController);
exports.container.bind(types_1.TYPES.SkillController).to(SkillController_1.SkillController);
exports.container.bind(types_1.TYPES.BrowseSkillsController).to(BrowseSkillsController_1.BrowseSkillsController);
exports.container.bind(types_1.TYPES.SkillDetailsController).to(SkillDetailsController_1.SkillDetailsController);
exports.container.bind(types_1.TYPES.SkillTemplateController).to(SkillTemplateController_1.SkillTemplateController);
exports.container.bind(types_1.TYPES.TemplateQuestionController).to(TemplateQuestionController_1.TemplateQuestionController);
exports.container.bind(types_1.TYPES.MCQTestController).to(MCQTestController_1.MCQTestController);
exports.container.bind(types_1.TYPES.AdminSkillController).to(AdminSkillController_1.AdminSkillController);
exports.container.bind(types_1.TYPES.SessionManagementController).to(SessionManagementController_1.SessionManagementController);
exports.container.bind(types_1.TYPES.BookingController).to(BookingController_1.BookingController);
exports.container.bind(types_1.TYPES.BookingRoutes).to(bookingRoutes_1.BookingRoutes);
// Routes
exports.container.bind(types_1.TYPES.AuthRoutes).to(authRoutes_1.AuthRoutes);
exports.container.bind(types_1.TYPES.AdminRoutes).to(adminRoutes_1.AdminRoutes);
exports.container.bind(types_1.TYPES.SubscriptionRoutes).to(subscriptionRoutes_1.SubscriptionRoutes);
exports.container.bind(types_1.TYPES.PublicSubscriptionRoutes).to(publicSubscriptionRoutes_1.PublicSubscriptionRoutes);
exports.container.bind(types_1.TYPES.UserProfileRoutes).to(userProfileRoutes_1.UserProfileRoutes);
exports.container.bind(types_1.TYPES.SkillRoutes).to(skillRoutes_1.SkillRoutes);
exports.container.bind(types_1.TYPES.BrowseSkillsRoutes).to(browseSkillsRoutes_1.BrowseSkillsRoutes);
exports.container.bind(types_1.TYPES.SkillTemplateRoutes).to(skillTemplateRoutes_1.SkillTemplateRoutes);
exports.container.bind(types_1.TYPES.PublicSkillTemplateRoutes).to(publicSkillTemplateRoutes_1.PublicSkillTemplateRoutes);
exports.container.bind(types_1.TYPES.TemplateQuestionRoutes).to(templateQuestionRoutes_1.TemplateQuestionRoutes);
exports.container.bind(types_1.TYPES.MCQTestRoutes).to(mcqTestRoutes_1.MCQTestRoutes);
exports.container.bind(types_1.TYPES.AdminSkillRoutes).to(adminSkillRoutes_1.AdminSkillRoutes);
// Response Builder
exports.container.bind(types_1.TYPES.IResponseBuilder).to(ResponseBuilder_1.ResponseBuilder);
// App
exports.container.bind(types_1.TYPES.App).to(server_1.App);
exports.container.bind(types_1.TYPES.IMCQImportJobRepository).to(MCQImportJobRepository_1.MCQImportJobRepository); // Add new repo binding
// ...
// Services
exports.container.bind(types_1.TYPES.IJobQueueService).to(JobQueueService_1.JobQueueService); // Add new service binding
// ...
// MCQ Import Use Cases & Processor
exports.container.bind(types_1.TYPES.MCQImportJobProcessor).to(MCQImportJobProcessor_1.MCQImportJobProcessor);
exports.container.bind(types_1.TYPES.StartMCQImportUseCase).to(StartMCQImportUseCase_1.StartMCQImportUseCase);
exports.container.bind(types_1.TYPES.ListMCQImportJobsUseCase).to(ListMCQImportJobsUseCase_1.ListMCQImportJobsUseCase);
exports.container.bind(types_1.TYPES.DownloadMCQImportErrorsUseCase).to(DownloadMCQImportErrorsUseCase_1.DownloadMCQImportErrorsUseCase);
// Controllers
exports.container.bind(types_1.TYPES.MCQImportController).to(MCQImportController_1.MCQImportController); // Add new controller binding
// ...
// Routes
exports.container.bind(types_1.TYPES.MCQImportRoutes).to(MCQImportRoutes_1.MCQImportRoutes); // Add new route binding
//# sourceMappingURL=container.js.map