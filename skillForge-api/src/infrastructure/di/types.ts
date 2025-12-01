export const TYPES = {
  Database: Symbol.for('Database'),
  RedisService: Symbol.for('RedisService'),
  IUserRepository: Symbol.for('IUserRepository'),
  IOTPRepository: Symbol.for('IOTPRepository'),
  IPasswordService: Symbol.for('IPasswordService'),
  IJWTService: Symbol.for('IJWTService'),
  IOTPService: Symbol.for('IOTPService'),
  IEmailService: Symbol.for('IEmailService'),
  IPendingRegistrationService: Symbol.for('IPendingRegistrationService'),
  PassportService: Symbol.for('PassportService'),
  RegisterUseCase: Symbol.for('RegisterUseCase'),
  LoginUseCase: Symbol.for('LoginUseCase'),
  VerifyOtpUseCase: Symbol.for('VerifyOtpUseCase'),
  ResendOtpUseCase: Symbol.for('ResendOtpUseCase'),
  AdminLoginUseCase: Symbol.for('AdminLoginUseCase'),
  GoogleAuthUseCase: Symbol.for('GoogleAuthUseCase'),
  ForgotPasswordUseCase: Symbol.for('ForgotPasswordUseCase'),
  VerifyForgotPasswordOtpUseCase: Symbol.for('VerifyForgotPasswordOtpUseCase'),
  ResetPasswordUseCase: Symbol.for('ResetPasswordUseCase'),
  // Admin Use Cases
  ListUsersUseCase: Symbol.for('ListUsersUseCase'),
  SuspendUserUseCase: Symbol.for('SuspendUserUseCase'),
  UnsuspendUserUseCase: Symbol.for('UnsuspendUserUseCase'),
  // Subscription Repository
  ISubscriptionPlanRepository: Symbol.for('ISubscriptionPlanRepository'),
  // Subscription Use Cases
  ListSubscriptionPlansUseCase: Symbol.for('ListSubscriptionPlansUseCase'),
  ListPublicSubscriptionPlansUseCase: Symbol.for('ListPublicSubscriptionPlansUseCase'),
  GetSubscriptionStatsUseCase: Symbol.for('GetSubscriptionStatsUseCase'),
  CreateSubscriptionPlanUseCase: Symbol.for('CreateSubscriptionPlanUseCase'),
  UpdateSubscriptionPlanUseCase: Symbol.for('UpdateSubscriptionPlanUseCase'),
  DeleteSubscriptionPlanUseCase: Symbol.for('DeleteSubscriptionPlanUseCase'),
  // Controllers
  AuthController: Symbol.for('AuthController'),
  AdminController: Symbol.for('AdminController'),
  SubscriptionController: Symbol.for('SubscriptionController'),
  PublicSubscriptionController: Symbol.for('PublicSubscriptionController'),
  // Routes
  AuthRoutes: Symbol.for('AuthRoutes'),
  AdminRoutes: Symbol.for('AdminRoutes'),
  SubscriptionRoutes: Symbol.for('SubscriptionRoutes'),
  PublicSubscriptionRoutes: Symbol.for('PublicSubscriptionRoutes'),
  // App
  App: Symbol.for('App'),
  // Response Builder
  IResponseBuilder: Symbol.for('IResponseBuilder'),

  //Skills
  ISkillRepository:Symbol.for('ISkillRepository'),
  IS3Service: Symbol.for('IS3Service'),
  CreateSkillUseCase: Symbol.for('CreateSkillUseCase'),
  ListUserSkillsUseCase: Symbol.for('ListUserSkillsUseCase'),
  SkillController: Symbol.for('SkillController'),
  SkillRoutes: Symbol.for('SkillRoutes'),

  // Skill Templates
  ISkillTemplateRepository: Symbol.for('ISkillTemplateRepository'),
  CreateSkillTemplateUseCase: Symbol.for('CreateSkillTemplateUseCase'),
  ListSkillTemplatesUseCase: Symbol.for('ListSkillTemplatesUseCase'),
  UpdateSkillTemplateUseCase: Symbol.for('UpdateSkillTemplateUseCase'),
  DeleteSkillTemplateUseCase: Symbol.for('DeleteSkillTemplateUseCase'),
  ToggleSkillTemplateStatusUseCase: Symbol.for('ToggleSkillTemplateStatusUseCase'),
  SkillTemplateController: Symbol.for('SkillTemplateController'),
  SkillTemplateRoutes: Symbol.for('SkillTemplateRoutes'),

  // Template Questions
  ITemplateQuestionRepository: Symbol.for('ITemplateQuestionRepository'),
  CreateTemplateQuestionUseCase: Symbol.for('CreateTemplateQuestionUseCase'),
  ListTemplateQuestionsUseCase: Symbol.for('ListTemplateQuestionsUseCase'),
  UpdateTemplateQuestionUseCase: Symbol.for('UpdateTemplateQuestionUseCase'),
  DeleteTemplateQuestionUseCase: Symbol.for('DeleteTemplateQuestionUseCase'),
  TemplateQuestionController: Symbol.for('TemplateQuestionController'),
  TemplateQuestionRoutes: Symbol.for('TemplateQuestionRoutes')

};