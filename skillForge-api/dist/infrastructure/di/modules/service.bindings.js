"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindServiceModule = void 0;
const types_1 = require("../types");
const Database_1 = require("../../database/Database");
const RedisService_1 = require("../../services/RedisService");
const PasswordService_1 = require("../../services/PasswordService");
const JWTService_1 = require("../../services/JWTService");
const OTPService_1 = require("../../services/OTPService");
const EmailService_1 = require("../../services/EmailService");
const PendingRegistrationService_1 = require("../../services/PendingRegistrationService");
const PassportService_1 = require("../../services/PassportService");
const S3StorageService_1 = require("../../services/S3StorageService");
const JobQueueService_1 = require("../../services/JobQueueService");
const WebSocketService_1 = require("../../services/WebSocketService");
const PaginationService_1 = require("../../services/PaginationService");
const StripePaymentGateway_1 = require("../../services/StripePaymentGateway");
const client_1 = require("@prisma/client");
const ResponseBuilder_1 = require("../../../shared/http/ResponseBuilder");
const TransactionService_1 = require("../../services/TransactionService");
/**
 * Binds all service interfaces to their implementations
 */
const bindServiceModule = (container) => {
    // Core Services
    container.bind(types_1.TYPES.Database).toConstantValue(Database_1.Database.getInstance());
    container.bind(types_1.TYPES.RedisService).toConstantValue(RedisService_1.RedisService.getInstance());
    // Prisma Client
    const prisma = new client_1.PrismaClient();
    container.bind(types_1.TYPES.PrismaClient).toConstantValue(prisma);
    // Auth Services
    container.bind(types_1.TYPES.IPasswordService).to(PasswordService_1.PasswordService);
    container.bind(types_1.TYPES.IJWTService).to(JWTService_1.JWTService);
    container.bind(types_1.TYPES.IOTPService).to(OTPService_1.OTPService);
    container.bind(types_1.TYPES.IEmailService).to(EmailService_1.EmailService);
    container.bind(types_1.TYPES.IPendingRegistrationService).to(PendingRegistrationService_1.PendingRegistrationService);
    container.bind(types_1.TYPES.PassportService).to(PassportService_1.PassportService);
    // Infrastructure Services
    container.bind(types_1.TYPES.IStorageService).to(S3StorageService_1.S3StorageService);
    container.bind(types_1.TYPES.IJobQueueService).to(JobQueueService_1.JobQueueService);
    container.bind(types_1.TYPES.IWebSocketService).to(WebSocketService_1.WebSocketService).inSingletonScope();
    container.bind(types_1.TYPES.IPaginationService).to(PaginationService_1.PaginationService);
    container.bind(types_1.TYPES.IPaymentGateway).to(StripePaymentGateway_1.StripePaymentGateway).inSingletonScope();
    container.bind(types_1.TYPES.ITransactionService).to(TransactionService_1.TransactionService);
    // Shared Services
    container.bind(types_1.TYPES.IResponseBuilder).to(ResponseBuilder_1.ResponseBuilder);
};
exports.bindServiceModule = bindServiceModule;
//# sourceMappingURL=service.bindings.js.map