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
import { BrowseSkillsRoutes } from './routes/skill/browseSkillsRoutes';
import { SkillTemplateRoutes } from './routes/skillTemplate/skillTemplateRoutes';
import { PublicSkillTemplateRoutes } from './routes/skillTemplate/publicSkillTemplateRoutes';
import { TemplateQuestionRoutes } from './routes/templateQuestion/templateQuestionRoutes';
import { MCQTestRoutes } from './routes/mcq/mcqTestRoutes';
import { AdminSkillRoutes } from './routes/admin/adminSkillRoutes';
import { BookingRoutes } from './routes/bookingRoutes';
import { UserProfileRoutes } from './routes/user/userProfileRoutes';
import userProfileRoutesLegacy from './routes/userProfileRoutes';
import sessionManagementRoutes from './routes/sessionManagementRoutes';
import { generalLimiter } from './middlewares/rateLimitMiddleware';
import { PassportService } from '../infrastructure/services/PassportService';
import { MCQImportRoutes } from './routes/mcq/MCQImportRoutes';
import { AvailabilityRoutes } from './routes/availability/availabilityRoutes';
import { CommunityRoutes } from './routes/community/communityRoutes';
import { PaymentRoutes } from './routes/payment/paymentRoutes';
import { UserSubscriptionRoutes } from './routes/subscription/userSubscriptionRoutes';
import { ProjectRoutes } from './routes/project/projectRoutes';
import { AdminWalletRoutes } from './routes/admin/AdminWalletRoutes';
import { AdminSessionRoutes } from './routes/admin/adminSessionRoutes';
import { VideoCallRoutes } from './routes/videoCall/VideoCallRoutes';
import { ReviewRoutes } from './routes/review/ReviewRoutes';
import { ProjectApplicationRoutes } from './routes/projectApplication/ProjectApplicationRoutes';
import { InterviewRoutes } from './routes/interview/InterviewRoutes';
import { WalletRoutes } from './routes/wallet/walletRoutes';
import { ReportRoutes } from './routes/ReportRoutes';
import { AdminReportRoutes } from './routes/admin/AdminReportRoutes';
import { ProjectMessageRoutes } from './routes/project/ProjectMessageRoutes';

@injectable()
export class App {
    private app: Application;

    constructor(
        @inject(TYPES.AuthRoutes) private readonly authRoutes: AuthRoutes,
        @inject(TYPES.AdminRoutes) private readonly adminRoutes: AdminRoutes,
        @inject(TYPES.PublicSubscriptionRoutes) private readonly publicSubscriptionRoutes: PublicSubscriptionRoutes,
        @inject(TYPES.SkillRoutes) private readonly skillRoutes: SkillRoutes,
        @inject(TYPES.BrowseSkillsRoutes) private readonly browseSkillsRoutes: BrowseSkillsRoutes,
        @inject(TYPES.SkillTemplateRoutes) private readonly skillTemplateRoutes: SkillTemplateRoutes,
        @inject(TYPES.PublicSkillTemplateRoutes) private readonly publicSkillTemplateRoutes: PublicSkillTemplateRoutes,
        @inject(TYPES.TemplateQuestionRoutes) private readonly templateQuestionRoutes: TemplateQuestionRoutes,
        @inject(TYPES.MCQTestRoutes) private readonly mcqTestRoutes: MCQTestRoutes,
        @inject(TYPES.AdminSkillRoutes) private readonly adminSkillRoutes: AdminSkillRoutes,
        @inject(TYPES.BookingRoutes) private readonly bookingRoutes: BookingRoutes,
        @inject(TYPES.UserProfileRoutes) private readonly userProfileRoutes: UserProfileRoutes,
        @inject(TYPES.MCQImportRoutes) private readonly mcqImportRoutes: MCQImportRoutes,
        @inject(TYPES.AvailabilityRoutes) private readonly availabilityRoutes: AvailabilityRoutes,
        @inject(TYPES.CommunityRoutes) private readonly communityRoutes: CommunityRoutes,
        @inject(TYPES.PaymentRoutes) private readonly paymentRoutes: PaymentRoutes,
        @inject(TYPES.UserSubscriptionRoutes) private readonly userSubscriptionRoutes: UserSubscriptionRoutes,
        @inject(TYPES.ProjectRoutes) private readonly projectRoutes: ProjectRoutes,
        @inject(TYPES.AdminWalletRoutes) private readonly adminWalletRoutes: AdminWalletRoutes,
        @inject(TYPES.AdminSessionRoutes) private readonly adminSessionRoutes: AdminSessionRoutes,
        @inject(TYPES.VideoCallRoutes) private readonly videoCallRoutes: VideoCallRoutes,
        @inject(TYPES.ReviewRoutes) private readonly reviewRoutes: ReviewRoutes,
        @inject(TYPES.ProjectApplicationRoutes) private readonly projectApplicationRoutes: ProjectApplicationRoutes,
        @inject(TYPES.InterviewRoutes) private readonly interviewRoutes: InterviewRoutes,
        @inject(TYPES.WalletRoutes) private readonly walletRoutes: WalletRoutes,
        @inject(TYPES.ReportRoutes) private readonly reportRoutes: ReportRoutes,
        @inject(TYPES.AdminReportRoutes) private readonly adminReportRoutes: AdminReportRoutes,
        @inject(TYPES.ProjectMessageRoutes) private readonly projectMessageRoutes: ProjectMessageRoutes,
        @inject(TYPES.PassportService) private readonly passportService: PassportService

    ) {
        this.app = express();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandlers();
    }

    private setupMiddlewares(): void {

        this.app.use(helmet());

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


        this.app.use(this.passportService.initializePassport());


        this.app.get('/api/v1/health', (_req, res) => {
            res.status(HttpStatusCode.OK).json({ status: 'UP', service: 'SkillSwap API' });
        });


        this.app.use('/api/v1', generalLimiter);
    }

    private setupRoutes(): void {
        this.app.use('/api/v1/auth', this.authRoutes.router);
        this.app.use('/api/v1/subscriptions', this.publicSubscriptionRoutes.router);
        this.app.use('/api/v1/profile', this.userProfileRoutes.getRouter());
        this.app.use('/api/v1/users', userProfileRoutesLegacy);
        // IMPORTANT: Specific routes MUST come before parameterized routes
        // /skills/me must be registered before /skills/:skillId
        this.app.use('/api/v1/skills', this.skillRoutes.router);
        this.app.use('/api/v1/skills', this.browseSkillsRoutes.getRouter());
        this.app.use('/api/v1/skill-templates', this.publicSkillTemplateRoutes.router);
        this.app.use('/api/v1/mcq', this.mcqTestRoutes.getRouter());
        this.app.use('/api/v1/bookings', this.bookingRoutes.router);
        this.app.use('/api/v1/sessions', sessionManagementRoutes);
        this.app.use('/api/v1/admin', this.adminRoutes.router);
        this.app.use('/api/v1/admin/skills', this.adminSkillRoutes.getRouter());
        this.app.use('/api/v1/admin/skill-templates', this.skillTemplateRoutes.router);
        this.app.use('/api/v1/admin/skill-templates/:templateId/questions', this.templateQuestionRoutes.router);
        this.app.use('/api/v1/admin/mcq', this.mcqImportRoutes.getRouter());
        this.app.use('/api/v1/availability', this.availabilityRoutes.router);
        this.app.use('/api/v1/communities', this.communityRoutes.getRouter());
        this.app.use('/api/v1/payments', this.paymentRoutes.getRouter());
        this.app.use('/api/v1/subscriptions', this.userSubscriptionRoutes.router);
        this.app.use('/api/v1/projects', this.projectRoutes.router);
        this.app.use('/api/v1/admin/wallet', this.adminWalletRoutes.router);
        this.app.use('/api/v1/admin/sessions', this.adminSessionRoutes.router);
        this.app.use('/api/v1/video-call', this.videoCallRoutes.router);
        this.app.use('/api/v1/reviews', this.reviewRoutes.router);
        this.app.use('/api/v1/project-applications', this.projectApplicationRoutes.router);
        this.app.use('/api/v1/interviews', this.interviewRoutes.router);
        this.app.use('/api/v1/wallet', this.walletRoutes.router);
        this.app.use('/api/v1/reports', this.reportRoutes.router);
        this.app.use('/api/v1/admin/reports', this.adminReportRoutes.router);
        this.app.use('/api/v1', this.projectMessageRoutes.router); // Mounts at /api/v1/projects/:projectId/messages
        this.app.all('*', notFoundHandler);
    }

    private setupErrorHandlers(): void {
        this.app.use(errorHandler);
    }

    public getInstance(): Application {
        return this.app;
    }
}