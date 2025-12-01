import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { injectable, inject } from 'inversify';
import { TYPES } from '../infrastructure/di/types';
import { env } from '../config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { HttpStatusCode } from '../domain/enums/HttpStatusCode';
import { AuthRoutes } from './routes/auth/authRoutes';
import { AdminRoutes } from './routes/admin/adminRoutes';
import { PublicSubscriptionRoutes } from './routes/subscription/publicSubscriptionRoutes';
import { SkillRoutes } from './routes/skill/skillRoutes';
import { SkillTemplateRoutes } from './routes/skillTemplate/skillTemplateRoutes';
import { TemplateQuestionRoutes } from './routes/templateQuestion/templateQuestionRoutes';
import { generalLimiter } from './middlewares/rateLimitMiddileWare';
import { PassportService } from '../infrastructure/services/PassportService';

@injectable()
export class App {
  private app: Application;

  constructor(
    @inject(TYPES.AuthRoutes) private readonly authRoutes: AuthRoutes,
    @inject(TYPES.AdminRoutes) private readonly adminRoutes: AdminRoutes,
    @inject(TYPES.PublicSubscriptionRoutes) private readonly publicSubscriptionRoutes: PublicSubscriptionRoutes,
    @inject(TYPES.SkillRoutes) private readonly skillRoutes: SkillRoutes,
    @inject(TYPES.SkillTemplateRoutes) private readonly skillTemplateRoutes: SkillTemplateRoutes,
    @inject(TYPES.TemplateQuestionRoutes) private readonly templateQuestionRoutes: TemplateQuestionRoutes,
    @inject(TYPES.PassportService) private readonly passportService: PassportService
  ) {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  private setupMiddlewares(): void {
    // Security Middleware
    this.app.use(helmet());
    // CORS Configuration - Allow multiple origins for development
    const allowedOrigins = [
      env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:5173',
      'http://localhost:5174'
    ];
    this.app.use(cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    }));
    this.app.use(express.json({ limit: '10kb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    this.app.use(cookieParser());
    
    // Initialize Passport for Google OAuth (must be before routes)
    this.app.use(this.passportService.initializePassport());
    
    // Health check endpoint (no rate limiting)
    this.app.get('/api/v1/health', (_req, res) => {
      res.status(HttpStatusCode.OK).json({ status: 'UP', service: 'SkillSwap API' });
    });
    
    // Apply general rate limiter to all routes except health
    this.app.use('/api/v1', generalLimiter);
  }

  private setupRoutes(): void {
    this.app.use('/api/v1/auth', this.authRoutes.router);
    this.app.use('/api/v1/admin', this.adminRoutes.router);
    this.app.use('/api/v1/subscriptions', this.publicSubscriptionRoutes.router);
    this.app.use('/api/v1/skills', this.skillRoutes.router);
    this.app.use('/api/v1/admin/skill-templates', this.skillTemplateRoutes.router);
    this.app.use('/api/v1/admin/skill-templates/:templateId/questions', this.templateQuestionRoutes.router);
    this.app.all('*', notFoundHandler);
  }

  private setupErrorHandlers(): void {
    this.app.use(errorHandler);
  }

  public getInstance(): Application {
    return this.app;
  }
}