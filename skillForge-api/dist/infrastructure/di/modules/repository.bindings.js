"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindRepositoryModule = void 0;
const types_1 = require("../types");
const UserRepository_1 = require("../../database/repositories/UserRepository");
const RedisOTPRepository_1 = require("../../database/repositories/RedisOTPRepository");
const SubscriptionPlanRepository_1 = require("../../database/repositories/SubscriptionPlanRepository");
const FeatureRepository_1 = require("../../database/repositories/FeatureRepository");
const SkillRepository_1 = require("../../database/repositories/SkillRepository");
const SkillTemplateRepository_1 = require("../../database/repositories/SkillTemplateRepository");
const TemplateQuestionRepository_1 = require("../../database/repositories/TemplateQuestionRepository");
const MCQRepository_1 = require("../../database/repositories/MCQRepository");
const BookingRepository_1 = require("../../database/repositories/BookingRepository");
const ProjectRepository_1 = require("../../database/repositories/ProjectRepository");
const MCQImportJobRepository_1 = require("../../database/repositories/MCQImportJobRepository");
const CommunityRepository_1 = require("../../database/repositories/CommunityRepository");
const CommunityMessageRepository_1 = require("../../database/repositories/CommunityMessageRepository");
const MessageReactionRepository_1 = require("../../database/repositories/MessageReactionRepository");
const UserSubscriptionRepository_1 = require("../../database/repositories/UserSubscriptionRepository");
const UsageRecordRepository_1 = require("../../database/repositories/UsageRecordRepository");
const AvailabilityRepository_1 = require("../../database/repositories/AvailabilityRepository");
const PaymentRepository_1 = require("../../database/repositories/PaymentRepository");
const WalletTransactionRepository_1 = require("../../database/repositories/WalletTransactionRepository");
/**
 * Binds all repository interfaces to their implementations
 */
const bindRepositoryModule = (container) => {
    // Core Repositories
    container.bind(types_1.TYPES.IUserRepository).to(UserRepository_1.UserRepository);
    container.bind(types_1.TYPES.IOTPRepository).to(RedisOTPRepository_1.RedisOTPRepository);
    // Subscription Repositories
    container.bind(types_1.TYPES.ISubscriptionPlanRepository).to(SubscriptionPlanRepository_1.PrismaSubscriptionPlanRepository);
    container.bind(types_1.TYPES.IUserSubscriptionRepository).to(UserSubscriptionRepository_1.PrismaUserSubscriptionRepository);
    container.bind(types_1.TYPES.IUsageRecordRepository).to(UsageRecordRepository_1.UsageRecordRepository);
    container.bind(types_1.TYPES.IFeatureRepository).to(FeatureRepository_1.PrismaFeatureRepository);
    // Skill Repositories
    container.bind(types_1.TYPES.ISkillRepository).to(SkillRepository_1.SkillRepository);
    container.bind(types_1.TYPES.ISkillTemplateRepository).to(SkillTemplateRepository_1.SkillTemplateRepository);
    container.bind(types_1.TYPES.ITemplateQuestionRepository).to(TemplateQuestionRepository_1.TemplateQuestionRepository);
    container.bind(types_1.TYPES.IMCQRepository).to(MCQRepository_1.MCQRepository);
    container.bind(types_1.TYPES.IMCQImportJobRepository).to(MCQImportJobRepository_1.MCQImportJobRepository);
    // Booking & Project Repositories
    container.bind(types_1.TYPES.IBookingRepository).to(BookingRepository_1.BookingRepository);
    container.bind(types_1.TYPES.IProjectRepository).to(ProjectRepository_1.ProjectRepository);
    container.bind(types_1.TYPES.IAvailabilityRepository).to(AvailabilityRepository_1.PrismaAvailabilityRepository);
    // Community Repositories
    container.bind(types_1.TYPES.ICommunityRepository).to(CommunityRepository_1.CommunityRepository);
    container.bind(types_1.TYPES.ICommunityMessageRepository).to(CommunityMessageRepository_1.CommunityMessageRepository);
    container.bind(types_1.TYPES.IMessageReactionRepository).to(MessageReactionRepository_1.MessageReactionRepository);
    // Payment Repository
    container.bind(types_1.TYPES.IPaymentRepository).to(PaymentRepository_1.PrismaPaymentRepository).inSingletonScope();
    container.bind(types_1.TYPES.IWalletTransactionRepository).to(WalletTransactionRepository_1.WalletTransactionRepository);
};
exports.bindRepositoryModule = bindRepositoryModule;
//# sourceMappingURL=repository.bindings.js.map