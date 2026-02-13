import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { injectable, inject } from 'inversify';
import { TYPES } from '../infrastructure/di/types';
import { env } from '../config/env';
import { API_PREFIX, ROUTES } from '../config/routes';
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
import { IPassportService } from '../domain/services/IPassportService';
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
import { NotificationRoutes } from './routes/notification/notificationRoutes';
import { CreditPackageRoutes } from './routes/credit/CreditPackageRoutes';
import { CreditRoutes } from './routes/credit/CreditRoutes';
import { CreditRedemptionRoutes } from './routes/credit/CreditRedemptionRoutes';
import { AdminWithdrawalRoutes } from './routes/admin/AdminWithdrawalRoutes';



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
        @inject(TYPES.IPassportService) private readonly passportService: IPassportService,
        @inject(TYPES.NotificationRoutes) private readonly notificationRoutes: NotificationRoutes,
        @inject(TYPES.CreditPackageRoutes) private readonly creditPackageRoutes: CreditPackageRoutes,
        @inject(TYPES.CreditRoutes) private readonly creditRoutes: CreditRoutes,
        @inject(TYPES.CreditRedemptionRoutes) private readonly creditRedemptionRoutes: CreditRedemptionRoutes,
        @inject(TYPES.AdminWithdrawalRoutes) private readonly adminWithdrawalRoutes: AdminWithdrawalRoutes,
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


        this.app.get(`${API_PREFIX}${ROUTES.HEALTH}`, (_req, res) => {
            res.status(HttpStatusCode.OK).json({ status: 'UP', service: 'SkillSwap API' });
        });


        this.app.use(API_PREFIX, generalLimiter);
    }

    private setupRoutes(): void {
        // Auth & User Management
        this.app.use(`${API_PREFIX}${ROUTES.AUTH}`, this.authRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.PROFILE}`, this.userProfileRoutes.getRouter());
        this.app.use(`${API_PREFIX}${ROUTES.USERS}`, userProfileRoutesLegacy);

        // Subscriptions
        this.app.use(`${API_PREFIX}${ROUTES.SUBSCRIPTIONS}`, this.publicSubscriptionRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.SUBSCRIPTIONS}`, this.userSubscriptionRoutes.router);

        // Skills & Templates
        // IMPORTANT: Specific routes MUST come before parameterized routes
        // /skills/me must be registered before /skills/:skillId
        this.app.use(`${API_PREFIX}${ROUTES.SKILLS}`, this.skillRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.SKILLS}`, this.browseSkillsRoutes.getRouter());
        this.app.use(`${API_PREFIX}${ROUTES.SKILL_TEMPLATES}`, this.publicSkillTemplateRoutes.router);

        // MCQ & Tests
        this.app.use(`${API_PREFIX}${ROUTES.MCQ}`, this.mcqTestRoutes.getRouter());

        // Bookings & Sessions
        this.app.use(`${API_PREFIX}${ROUTES.BOOKINGS}`, this.bookingRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.SESSIONS}`, sessionManagementRoutes);
        this.app.use(`${API_PREFIX}${ROUTES.AVAILABILITY}`, this.availabilityRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.VIDEO_CALL}`, this.videoCallRoutes.router);

        // Community & Projects
        this.app.use(`${API_PREFIX}${ROUTES.COMMUNITIES}`, this.communityRoutes.getRouter());
        this.app.use(`${API_PREFIX}${ROUTES.PROJECTS}`, this.projectRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.PROJECT_APPLICATIONS}`, this.projectApplicationRoutes.router);
        this.app.use(API_PREFIX, this.projectMessageRoutes.router); // Mounts at /api/v1/projects/:projectId/messages

        // Payments & Wallet
        this.app.use(`${API_PREFIX}${ROUTES.PAYMENTS}`, this.paymentRoutes.getRouter());
        this.app.use(`${API_PREFIX}${ROUTES.WALLET}`, this.walletRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.CREDITS}`, this.creditRoutes.router);

        // Reviews & Reports
        this.app.use(`${API_PREFIX}${ROUTES.REVIEWS}`, this.reviewRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.REPORTS}`, this.reportRoutes.router);

        // Interviews
        this.app.use(`${API_PREFIX}${ROUTES.INTERVIEWS}`, this.interviewRoutes.router);

        // Admin Routes
        this.app.use(`${API_PREFIX}${ROUTES.ADMIN.BASE}`, this.adminRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.ADMIN.SKILLS}`, this.adminSkillRoutes.getRouter());
        this.app.use(`${API_PREFIX}${ROUTES.ADMIN.SKILL_TEMPLATES}`, this.skillTemplateRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.ADMIN.TEMPLATE_QUESTIONS}`, this.templateQuestionRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.ADMIN.MCQ}`, this.mcqImportRoutes.getRouter());
        this.app.use(`${API_PREFIX}${ROUTES.ADMIN.WALLET}`, this.adminWalletRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.ADMIN.SESSIONS}`, this.adminSessionRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.ADMIN.REPORTS}`, this.adminReportRoutes.router);

        this.app.use(`${API_PREFIX}${ROUTES.NOTIFICATIONS}`, this.notificationRoutes.router)
        this.app.use(`${API_PREFIX}${ROUTES.ADMIN.CREDIT_PACKAGES}`, this.creditPackageRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.CREDIT_REDEMPTION.BASE}`, this.creditRedemptionRoutes.router);
        this.app.use(`${API_PREFIX}${ROUTES.ADMIN.WITHDRAWALS}`, this.adminWithdrawalRoutes.router);

        // 404 Handler
        this.app.all('*', notFoundHandler);
    }

    private setupErrorHandlers(): void {
        this.app.use(errorHandler);
    }

    public getInstance(): Application {
        return this.app;
    }
}
