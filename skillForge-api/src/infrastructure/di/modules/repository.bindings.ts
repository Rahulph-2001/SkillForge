import { type Container } from 'inversify';
import { TYPES } from '../types';
import { type IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserRepository } from '../../database/repositories/UserRepository';
import { type IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { RedisOTPRepository } from '../../database/repositories/RedisOTPRepository';
import { type ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { PrismaSubscriptionPlanRepository } from '../../database/repositories/SubscriptionPlanRepository';
import { type IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { PrismaFeatureRepository } from '../../database/repositories/FeatureRepository';
import { type ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { SkillRepository } from '../../database/repositories/SkillRepository';
import { type ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplateRepository } from '../../database/repositories/SkillTemplateRepository';
import { type ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { TemplateQuestionRepository } from '../../database/repositories/TemplateQuestionRepository';
import { type IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { MCQRepository } from '../../database/repositories/MCQRepository';
import { type IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingRepository } from '../../database/repositories/BookingRepository';
import { type IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { ProjectRepository } from '../../database/repositories/ProjectRepository';
import { type IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { MCQImportJobRepository } from '../../database/repositories/MCQImportJobRepository';
import { type ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { CommunityRepository } from '../../database/repositories/CommunityRepository';
import { type ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { CommunityMessageRepository } from '../../database/repositories/CommunityMessageRepository';
import { type IMessageReactionRepository } from '../../../domain/repositories/IMessageReactionRepository';
import { MessageReactionRepository } from '../../database/repositories/MessageReactionRepository';
import { type IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { PrismaUserSubscriptionRepository } from '../../database/repositories/UserSubscriptionRepository';
import { type IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { UsageRecordRepository } from '../../database/repositories/UsageRecordRepository';
import { type IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { PrismaAvailabilityRepository } from '../../database/repositories/AvailabilityRepository';
import { type IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { PrismaPaymentRepository } from '../../database/repositories/PaymentRepository';
import { type IWalletTransactionRepository } from '../../../domain/repositories/IWalletTransactionRepository';
import { WalletTransactionRepository } from '../../database/repositories/WalletTransactionRepository';

/**
 * Binds all repository interfaces to their implementations
 */
export const bindRepositoryModule = (container: Container): void => {
  // Core Repositories
  container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
  container.bind<IOTPRepository>(TYPES.IOTPRepository).to(RedisOTPRepository);

  // Subscription Repositories
  container.bind<ISubscriptionPlanRepository>(TYPES.ISubscriptionPlanRepository).to(PrismaSubscriptionPlanRepository);
  container.bind<IUserSubscriptionRepository>(TYPES.IUserSubscriptionRepository).to(PrismaUserSubscriptionRepository);
  container.bind<IUsageRecordRepository>(TYPES.IUsageRecordRepository).to(UsageRecordRepository);
  container.bind<IFeatureRepository>(TYPES.IFeatureRepository).to(PrismaFeatureRepository);

  // Skill Repositories
  container.bind<ISkillRepository>(TYPES.ISkillRepository).to(SkillRepository);
  container.bind<ISkillTemplateRepository>(TYPES.ISkillTemplateRepository).to(SkillTemplateRepository);
  container.bind<ITemplateQuestionRepository>(TYPES.ITemplateQuestionRepository).to(TemplateQuestionRepository);
  container.bind<IMCQRepository>(TYPES.IMCQRepository).to(MCQRepository);
  container.bind<IMCQImportJobRepository>(TYPES.IMCQImportJobRepository).to(MCQImportJobRepository);

  // Booking & Project Repositories
  container.bind<IBookingRepository>(TYPES.IBookingRepository).to(BookingRepository);
  container.bind<IProjectRepository>(TYPES.IProjectRepository).to(ProjectRepository);
  container.bind<IAvailabilityRepository>(TYPES.IAvailabilityRepository).to(PrismaAvailabilityRepository);

  // Community Repositories
  container.bind<ICommunityRepository>(TYPES.ICommunityRepository).to(CommunityRepository);
  container.bind<ICommunityMessageRepository>(TYPES.ICommunityMessageRepository).to(CommunityMessageRepository);
  container.bind<IMessageReactionRepository>(TYPES.IMessageReactionRepository).to(MessageReactionRepository);

  // Payment Repository
  container.bind<IPaymentRepository>(TYPES.IPaymentRepository).to(PrismaPaymentRepository).inSingletonScope();
  container.bind<IWalletTransactionRepository>(TYPES.IWalletTransactionRepository).to(WalletTransactionRepository)
};

