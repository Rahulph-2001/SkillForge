import { Container } from 'inversify';
import { TYPES } from '../types';
import { Database } from '../../database/Database';
import { RedisService } from '../../services/RedisService';
import { IPasswordService } from '../../../domain/services/IPasswordService';
import { PasswordService } from '../../services/PasswordService';
import { IJWTService } from '../../../domain/services/IJWTService';
import { JWTService } from '../../services/JWTService';
import { IOTPService } from '../../../domain/services/IOTPService';
import { OTPService } from '../../services/OTPService';
import { IEmailService } from '../../../domain/services/IEmailService';
import { EmailService } from '../../services/EmailService';
import { IPendingRegistrationService } from '../../../domain/services/IPendingRegistrationService';
import { PendingRegistrationService } from '../../services/PendingRegistrationService';
import { PassportService } from '../../services/PassportService';
import { IStorageService } from '../../../domain/services/IStorageService';
import { S3StorageService } from '../../services/S3StorageService';
import { IJobQueueService } from '../../../domain/services/IJobQueueService';
import { JobQueueService } from '../../services/JobQueueService';
import { IWebSocketService } from '../../../domain/services/IWebSocketService';
import { WebSocketService } from '../../services/WebSocketService';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { PaginationService } from '../../services/PaginationService';
import { IPaymentGateway } from '../../../domain/services/IPaymentGateway';
import { StripePaymentGateway } from '../../services/StripePaymentGateway';
import { PrismaClient } from '@prisma/client';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { ResponseBuilder } from '../../../shared/http/ResponseBuilder';
import { ITransactionService } from '../../../domain/services/ITransactionService';
import { TransactionService } from '../../services/TransactionService';

/**
 * Binds all service interfaces to their implementations
 */
export const bindServiceModule = (container: Container): void => {
  // Core Services
  container.bind<Database>(TYPES.Database).toConstantValue(Database.getInstance());
  container.bind<RedisService>(TYPES.RedisService).toConstantValue(RedisService.getInstance());
  
  // Prisma Client
  const prisma = new PrismaClient();
  container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(prisma);
  
  // Auth Services
  container.bind<IPasswordService>(TYPES.IPasswordService).to(PasswordService);
  container.bind<IJWTService>(TYPES.IJWTService).to(JWTService);
  container.bind<IOTPService>(TYPES.IOTPService).to(OTPService);
  container.bind<IEmailService>(TYPES.IEmailService).to(EmailService);
  container.bind<IPendingRegistrationService>(TYPES.IPendingRegistrationService).to(PendingRegistrationService);
  container.bind<PassportService>(TYPES.PassportService).to(PassportService);
  
  // Infrastructure Services
  container.bind<IStorageService>(TYPES.IStorageService).to(S3StorageService);
  container.bind<IJobQueueService>(TYPES.IJobQueueService).to(JobQueueService);
  container.bind<IWebSocketService>(TYPES.IWebSocketService).to(WebSocketService).inSingletonScope();
  container.bind<IPaginationService>(TYPES.IPaginationService).to(PaginationService);
  container.bind<IPaymentGateway>(TYPES.IPaymentGateway).to(StripePaymentGateway).inSingletonScope();
  container.bind<ITransactionService>(TYPES.ITransactionService).to(TransactionService)
  
  // Shared Services
  container.bind<IResponseBuilder>(TYPES.IResponseBuilder).to(ResponseBuilder);
};

