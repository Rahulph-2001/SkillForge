import 'reflect-metadata';
import { Container } from 'inversify';
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
import { ISubscriptionPlanRepository } from '../../domain/repositories/ISubscriptionPlanRepository';
import { PrismaSubscriptionPlanRepository } from '../database/repositories/PrismaSubscriptionPlanRepository';
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
import { AuthRoutes } from '../../presentation/routes/auth/authRoutes';
import { AdminRoutes } from '../../presentation/routes/admin/adminRoutes';
import { SubscriptionRoutes } from '../../presentation/routes/subscription/subscriptionRoutes';
import { PublicSubscriptionRoutes } from '../../presentation/routes/subscription/publicSubscriptionRoutes';
import { App } from '../../presentation/server';
import { IResponseBuilder } from '../../shared/http/IResponseBuilder';
import { ResponseBuilder } from '../../shared/http/ResponseBuilder';
import { ISkillRepository } from '../../domain/repositories/ISkillRepository';
import { SkillRepository } from '../database/repositories/SkillRepository';
import { IS3Service } from '../../domain/services/IS3Service';
import { S3Service } from '../services/S3Service';
import { CreateSkillUseCase } from '../../application/useCases/skill/CreateSkillUseCase';
import { ListUserSkillsUseCase } from '../../application/useCases/skill/ListUserSkillsUseCase';
import { SkillController } from '../../presentation/controllers/skill/SkillController';
import { SkillRoutes } from '../../presentation/routes/skill/skillRoutes';
import { ISkillTemplateRepository } from '../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplateRepository } from '../database/repositories/SkillTemplateRepository';
import { CreateSkillTemplateUseCase } from '../../application/useCases/skillTemplate/CreateSkillTemplateUseCase';
import { ListSkillTemplatesUseCase } from '../../application/useCases/skillTemplate/ListSkillTemplatesUseCase';
import { UpdateSkillTemplateUseCase } from '../../application/useCases/skillTemplate/UpdateSkillTemplateUseCase';
import { DeleteSkillTemplateUseCase } from '../../application/useCases/skillTemplate/DeleteSkillTemplateUseCase';
import { ToggleSkillTemplateStatusUseCase } from '../../application/useCases/skillTemplate/ToggleSkillTemplateStatusUseCase';
import { SkillTemplateController } from '../../presentation/controllers/skillTemplate/SkillTemplateController';
import { SkillTemplateRoutes } from '../../presentation/routes/skillTemplate/skillTemplateRoutes';
import { ITemplateQuestionRepository } from '../../domain/repositories/ITemplateQuestionRepository';
import { TemplateQuestionRepository } from '../database/repositories/TemplateQuestionRepository';
import { CreateTemplateQuestionUseCase } from '../../application/useCases/templateQuestion/CreateTemplateQuestionUseCase';
import { ListTemplateQuestionsUseCase } from '../../application/useCases/templateQuestion/ListTemplateQuestionsUseCase';
import { UpdateTemplateQuestionUseCase } from '../../application/useCases/templateQuestion/UpdateTemplateQuestionUseCase';
import { DeleteTemplateQuestionUseCase } from '../../application/useCases/templateQuestion/DeleteTemplateQuestionUseCase';
import { TemplateQuestionController } from '../../presentation/controllers/templateQuestion/TemplateQuestionController';
import { TemplateQuestionRoutes } from '../../presentation/routes/templateQuestion/templateQuestionRoutes';

export const container = new Container();

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
// Subscription Repository
container.bind<ISubscriptionPlanRepository>(TYPES.ISubscriptionPlanRepository).to(PrismaSubscriptionPlanRepository);
// Subscription Use Cases
container.bind<ListSubscriptionPlansUseCase>(TYPES.ListSubscriptionPlansUseCase).to(ListSubscriptionPlansUseCase);
container.bind<ListPublicSubscriptionPlansUseCase>(TYPES.ListPublicSubscriptionPlansUseCase).to(ListPublicSubscriptionPlansUseCase);
container.bind<GetSubscriptionStatsUseCase>(TYPES.GetSubscriptionStatsUseCase).to(GetSubscriptionStatsUseCase);
container.bind<CreateSubscriptionPlanUseCase>(TYPES.CreateSubscriptionPlanUseCase).to(CreateSubscriptionPlanUseCase);
container.bind<UpdateSubscriptionPlanUseCase>(TYPES.UpdateSubscriptionPlanUseCase).to(UpdateSubscriptionPlanUseCase);
container.bind<DeleteSubscriptionPlanUseCase>(TYPES.DeleteSubscriptionPlanUseCase).to(DeleteSubscriptionPlanUseCase);
// Skill Repository and Services
container.bind<ISkillRepository>(TYPES.ISkillRepository).to(SkillRepository);
container.bind<IS3Service>(TYPES.IS3Service).to(S3Service);
// Skill Use Cases
container.bind<CreateSkillUseCase>(TYPES.CreateSkillUseCase).to(CreateSkillUseCase);
container.bind<ListUserSkillsUseCase>(TYPES.ListUserSkillsUseCase).to(ListUserSkillsUseCase);
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

// Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<AdminController>(TYPES.AdminController).to(AdminController);
container.bind<SubscriptionController>(TYPES.SubscriptionController).to(SubscriptionController);
container.bind<PublicSubscriptionController>(TYPES.PublicSubscriptionController).to(PublicSubscriptionController);
container.bind<SkillController>(TYPES.SkillController).to(SkillController);
container.bind<SkillTemplateController>(TYPES.SkillTemplateController).to(SkillTemplateController);
container.bind<TemplateQuestionController>(TYPES.TemplateQuestionController).to(TemplateQuestionController);
// Routes
container.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes);
container.bind<AdminRoutes>(TYPES.AdminRoutes).to(AdminRoutes);
container.bind<SubscriptionRoutes>(TYPES.SubscriptionRoutes).to(SubscriptionRoutes);
container.bind<PublicSubscriptionRoutes>(TYPES.PublicSubscriptionRoutes).to(PublicSubscriptionRoutes);
container.bind<SkillRoutes>(TYPES.SkillRoutes).to(SkillRoutes);
container.bind<SkillTemplateRoutes>(TYPES.SkillTemplateRoutes).to(SkillTemplateRoutes);
container.bind<TemplateQuestionRoutes>(TYPES.TemplateQuestionRoutes).to(TemplateQuestionRoutes);
// Response Builder
container.bind<IResponseBuilder>(TYPES.IResponseBuilder).to(ResponseBuilder);
// App
container.bind<App>(TYPES.App).to(App);