import { Container } from 'inversify';
import { TYPES } from '../types';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserRepository } from '../../database/repositories/UserRepository';
import { IOTPRepository } from '../../../domain/repositories/IOTPRepository';
import { RedisOTPRepository } from '../../database/repositories/RedisOTPRepository';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/ISubscriptionPlanRepository';
import { PrismaSubscriptionPlanRepository } from '../../database/repositories/SubscriptionPlanRepository';
import { IFeatureRepository } from '../../../domain/repositories/IFeatureRepository';
import { PrismaFeatureRepository } from '../../database/repositories/FeatureRepository';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { SkillRepository } from '../../database/repositories/SkillRepository';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplateRepository } from '../../database/repositories/SkillTemplateRepository';
import { ITemplateQuestionRepository } from '../../../domain/repositories/ITemplateQuestionRepository';
import { TemplateQuestionRepository } from '../../database/repositories/TemplateQuestionRepository';
import { IMCQRepository } from '../../../domain/repositories/IMCQRepository';
import { MCQRepository } from '../../database/repositories/MCQRepository';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingRepository } from '../../database/repositories/BookingRepository';
import { IProjectRepository } from '../../../domain/repositories/IProjectRepository';
import { ProjectRepository } from '../../database/repositories/ProjectRepository';
import { IMCQImportJobRepository } from '../../../domain/repositories/IMCQImportJobRepository';
import { MCQImportJobRepository } from '../../database/repositories/MCQImportJobRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { CommunityRepository } from '../../database/repositories/CommunityRepository';
import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { CommunityMessageRepository } from '../../database/repositories/CommunityMessageRepository';
import { IMessageReactionRepository } from '../../../domain/repositories/IMessageReactionRepository';
import { MessageReactionRepository } from '../../database/repositories/MessageReactionRepository';
import { IUserSubscriptionRepository } from '../../../domain/repositories/IUserSubscriptionRepository';
import { PrismaUserSubscriptionRepository } from '../../database/repositories/UserSubscriptionRepository';
import { IUsageRecordRepository } from '../../../domain/repositories/IUsageRecordRepository';
import { UsageRecordRepository } from '../../database/repositories/UsageRecordRepository';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { PrismaAvailabilityRepository } from '../../database/repositories/AvailabilityRepository';
import { IPaymentRepository } from '../../../domain/repositories/IPaymentRepository';
import { PrismaPaymentRepository } from '../../database/repositories/PaymentRepository';

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
};

