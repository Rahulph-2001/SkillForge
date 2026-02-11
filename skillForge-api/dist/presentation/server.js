"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const inversify_1 = require("inversify");
const types_1 = require("../infrastructure/di/types");
const env_1 = require("../config/env");
const routes_1 = require("../config/routes");
const errorHandler_1 = require("./middlewares/errorHandler");
const HttpStatusCode_1 = require("../domain/enums/HttpStatusCode");
const authRoutes_1 = require("./routes/auth/authRoutes");
const adminRoutes_1 = require("./routes/admin/adminRoutes");
const publicSubscriptionRoutes_1 = require("./routes/subscription/publicSubscriptionRoutes");
const skillRoutes_1 = require("./routes/skill/skillRoutes");
const browseSkillsRoutes_1 = require("./routes/skill/browseSkillsRoutes");
const skillTemplateRoutes_1 = require("./routes/skillTemplate/skillTemplateRoutes");
const publicSkillTemplateRoutes_1 = require("./routes/skillTemplate/publicSkillTemplateRoutes");
const templateQuestionRoutes_1 = require("./routes/templateQuestion/templateQuestionRoutes");
const mcqTestRoutes_1 = require("./routes/mcq/mcqTestRoutes");
const adminSkillRoutes_1 = require("./routes/admin/adminSkillRoutes");
const bookingRoutes_1 = require("./routes/bookingRoutes");
const userProfileRoutes_1 = require("./routes/user/userProfileRoutes");
const userProfileRoutes_2 = __importDefault(require("./routes/userProfileRoutes"));
const sessionManagementRoutes_1 = __importDefault(require("./routes/sessionManagementRoutes"));
const rateLimitMiddleware_1 = require("./middlewares/rateLimitMiddleware");
const MCQImportRoutes_1 = require("./routes/mcq/MCQImportRoutes");
const availabilityRoutes_1 = require("./routes/availability/availabilityRoutes");
const communityRoutes_1 = require("./routes/community/communityRoutes");
const paymentRoutes_1 = require("./routes/payment/paymentRoutes");
const userSubscriptionRoutes_1 = require("./routes/subscription/userSubscriptionRoutes");
const projectRoutes_1 = require("./routes/project/projectRoutes");
const AdminWalletRoutes_1 = require("./routes/admin/AdminWalletRoutes");
const adminSessionRoutes_1 = require("./routes/admin/adminSessionRoutes");
const VideoCallRoutes_1 = require("./routes/videoCall/VideoCallRoutes");
const ReviewRoutes_1 = require("./routes/review/ReviewRoutes");
const ProjectApplicationRoutes_1 = require("./routes/projectApplication/ProjectApplicationRoutes");
const InterviewRoutes_1 = require("./routes/interview/InterviewRoutes");
const walletRoutes_1 = require("./routes/wallet/walletRoutes");
const ReportRoutes_1 = require("./routes/ReportRoutes");
const AdminReportRoutes_1 = require("./routes/admin/AdminReportRoutes");
const ProjectMessageRoutes_1 = require("./routes/project/ProjectMessageRoutes");
const notificationRoutes_1 = require("./routes/notification/notificationRoutes");
const CreditPackageRoutes_1 = require("./routes/credit/CreditPackageRoutes");
const CreditRoutes_1 = require("./routes/credit/CreditRoutes");
let App = class App {
    constructor(authRoutes, adminRoutes, publicSubscriptionRoutes, skillRoutes, browseSkillsRoutes, skillTemplateRoutes, publicSkillTemplateRoutes, templateQuestionRoutes, mcqTestRoutes, adminSkillRoutes, bookingRoutes, userProfileRoutes, mcqImportRoutes, availabilityRoutes, communityRoutes, paymentRoutes, userSubscriptionRoutes, projectRoutes, adminWalletRoutes, adminSessionRoutes, videoCallRoutes, reviewRoutes, projectApplicationRoutes, interviewRoutes, walletRoutes, reportRoutes, adminReportRoutes, projectMessageRoutes, passportService, notificationRoutes, creditPackageRoutes, creditRoutes) {
        this.authRoutes = authRoutes;
        this.adminRoutes = adminRoutes;
        this.publicSubscriptionRoutes = publicSubscriptionRoutes;
        this.skillRoutes = skillRoutes;
        this.browseSkillsRoutes = browseSkillsRoutes;
        this.skillTemplateRoutes = skillTemplateRoutes;
        this.publicSkillTemplateRoutes = publicSkillTemplateRoutes;
        this.templateQuestionRoutes = templateQuestionRoutes;
        this.mcqTestRoutes = mcqTestRoutes;
        this.adminSkillRoutes = adminSkillRoutes;
        this.bookingRoutes = bookingRoutes;
        this.userProfileRoutes = userProfileRoutes;
        this.mcqImportRoutes = mcqImportRoutes;
        this.availabilityRoutes = availabilityRoutes;
        this.communityRoutes = communityRoutes;
        this.paymentRoutes = paymentRoutes;
        this.userSubscriptionRoutes = userSubscriptionRoutes;
        this.projectRoutes = projectRoutes;
        this.adminWalletRoutes = adminWalletRoutes;
        this.adminSessionRoutes = adminSessionRoutes;
        this.videoCallRoutes = videoCallRoutes;
        this.reviewRoutes = reviewRoutes;
        this.projectApplicationRoutes = projectApplicationRoutes;
        this.interviewRoutes = interviewRoutes;
        this.walletRoutes = walletRoutes;
        this.reportRoutes = reportRoutes;
        this.adminReportRoutes = adminReportRoutes;
        this.projectMessageRoutes = projectMessageRoutes;
        this.passportService = passportService;
        this.notificationRoutes = notificationRoutes;
        this.creditPackageRoutes = creditPackageRoutes;
        this.creditRoutes = creditRoutes;
        this.app = (0, express_1.default)();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandlers();
    }
    setupMiddlewares() {
        this.app.use((0, helmet_1.default)());
        const allowedOrigins = [
            env_1.env.FRONTEND_URL,
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:5173',
            'http://localhost:5174'
        ];
        this.app.use((0, cors_1.default)({
            origin: (origin, callback) => {
                if (!origin)
                    return callback(null, true);
                if (allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
        }));
        this.app.use(express_1.default.json({ limit: '10kb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(this.passportService.initializePassport());
        this.app.get(`${routes_1.API_PREFIX}${routes_1.ROUTES.HEALTH}`, (_req, res) => {
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ status: 'UP', service: 'SkillSwap API' });
        });
        this.app.use(routes_1.API_PREFIX, rateLimitMiddleware_1.generalLimiter);
    }
    setupRoutes() {
        // Auth & User Management
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.AUTH}`, this.authRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.PROFILE}`, this.userProfileRoutes.getRouter());
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.USERS}`, userProfileRoutes_2.default);
        // Subscriptions
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.SUBSCRIPTIONS}`, this.publicSubscriptionRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.SUBSCRIPTIONS}`, this.userSubscriptionRoutes.router);
        // Skills & Templates
        // IMPORTANT: Specific routes MUST come before parameterized routes
        // /skills/me must be registered before /skills/:skillId
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.SKILLS}`, this.skillRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.SKILLS}`, this.browseSkillsRoutes.getRouter());
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.SKILL_TEMPLATES}`, this.publicSkillTemplateRoutes.router);
        // MCQ & Tests
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.MCQ}`, this.mcqTestRoutes.getRouter());
        // Bookings & Sessions
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.BOOKINGS}`, this.bookingRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.SESSIONS}`, sessionManagementRoutes_1.default);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.AVAILABILITY}`, this.availabilityRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.VIDEO_CALL}`, this.videoCallRoutes.router);
        // Community & Projects
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.COMMUNITIES}`, this.communityRoutes.getRouter());
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.PROJECTS}`, this.projectRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.PROJECT_APPLICATIONS}`, this.projectApplicationRoutes.router);
        this.app.use(routes_1.API_PREFIX, this.projectMessageRoutes.router); // Mounts at /api/v1/projects/:projectId/messages
        // Payments & Wallet
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.PAYMENTS}`, this.paymentRoutes.getRouter());
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.WALLET}`, this.walletRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.CREDITS}`, this.creditRoutes.router);
        // Reviews & Reports
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.REVIEWS}`, this.reviewRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.REPORTS}`, this.reportRoutes.router);
        // Interviews
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.INTERVIEWS}`, this.interviewRoutes.router);
        // Admin Routes
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.ADMIN.BASE}`, this.adminRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.ADMIN.SKILLS}`, this.adminSkillRoutes.getRouter());
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.ADMIN.SKILL_TEMPLATES}`, this.skillTemplateRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.ADMIN.TEMPLATE_QUESTIONS}`, this.templateQuestionRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.ADMIN.MCQ}`, this.mcqImportRoutes.getRouter());
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.ADMIN.WALLET}`, this.adminWalletRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.ADMIN.SESSIONS}`, this.adminSessionRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.ADMIN.REPORTS}`, this.adminReportRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.NOTIFICATIONS}`, this.notificationRoutes.router);
        this.app.use(`${routes_1.API_PREFIX}${routes_1.ROUTES.ADMIN.CREDIT_PACKAGES}`, this.creditPackageRoutes.router);
        // 404 Handler
        this.app.all('*', errorHandler_1.notFoundHandler);
    }
    setupErrorHandlers() {
        this.app.use(errorHandler_1.errorHandler);
    }
    getInstance() {
        return this.app;
    }
};
exports.App = App;
exports.App = App = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.AuthRoutes)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.AdminRoutes)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.PublicSubscriptionRoutes)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.SkillRoutes)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.BrowseSkillsRoutes)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.SkillTemplateRoutes)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.PublicSkillTemplateRoutes)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.TemplateQuestionRoutes)),
    __param(8, (0, inversify_1.inject)(types_1.TYPES.MCQTestRoutes)),
    __param(9, (0, inversify_1.inject)(types_1.TYPES.AdminSkillRoutes)),
    __param(10, (0, inversify_1.inject)(types_1.TYPES.BookingRoutes)),
    __param(11, (0, inversify_1.inject)(types_1.TYPES.UserProfileRoutes)),
    __param(12, (0, inversify_1.inject)(types_1.TYPES.MCQImportRoutes)),
    __param(13, (0, inversify_1.inject)(types_1.TYPES.AvailabilityRoutes)),
    __param(14, (0, inversify_1.inject)(types_1.TYPES.CommunityRoutes)),
    __param(15, (0, inversify_1.inject)(types_1.TYPES.PaymentRoutes)),
    __param(16, (0, inversify_1.inject)(types_1.TYPES.UserSubscriptionRoutes)),
    __param(17, (0, inversify_1.inject)(types_1.TYPES.ProjectRoutes)),
    __param(18, (0, inversify_1.inject)(types_1.TYPES.AdminWalletRoutes)),
    __param(19, (0, inversify_1.inject)(types_1.TYPES.AdminSessionRoutes)),
    __param(20, (0, inversify_1.inject)(types_1.TYPES.VideoCallRoutes)),
    __param(21, (0, inversify_1.inject)(types_1.TYPES.ReviewRoutes)),
    __param(22, (0, inversify_1.inject)(types_1.TYPES.ProjectApplicationRoutes)),
    __param(23, (0, inversify_1.inject)(types_1.TYPES.InterviewRoutes)),
    __param(24, (0, inversify_1.inject)(types_1.TYPES.WalletRoutes)),
    __param(25, (0, inversify_1.inject)(types_1.TYPES.ReportRoutes)),
    __param(26, (0, inversify_1.inject)(types_1.TYPES.AdminReportRoutes)),
    __param(27, (0, inversify_1.inject)(types_1.TYPES.ProjectMessageRoutes)),
    __param(28, (0, inversify_1.inject)(types_1.TYPES.IPassportService)),
    __param(29, (0, inversify_1.inject)(types_1.TYPES.NotificationRoutes)),
    __param(30, (0, inversify_1.inject)(types_1.TYPES.CreditPackageRoutes)),
    __param(31, (0, inversify_1.inject)(types_1.TYPES.CreditRoutes)),
    __metadata("design:paramtypes", [authRoutes_1.AuthRoutes,
        adminRoutes_1.AdminRoutes,
        publicSubscriptionRoutes_1.PublicSubscriptionRoutes,
        skillRoutes_1.SkillRoutes,
        browseSkillsRoutes_1.BrowseSkillsRoutes,
        skillTemplateRoutes_1.SkillTemplateRoutes,
        publicSkillTemplateRoutes_1.PublicSkillTemplateRoutes,
        templateQuestionRoutes_1.TemplateQuestionRoutes,
        mcqTestRoutes_1.MCQTestRoutes,
        adminSkillRoutes_1.AdminSkillRoutes,
        bookingRoutes_1.BookingRoutes,
        userProfileRoutes_1.UserProfileRoutes,
        MCQImportRoutes_1.MCQImportRoutes,
        availabilityRoutes_1.AvailabilityRoutes,
        communityRoutes_1.CommunityRoutes,
        paymentRoutes_1.PaymentRoutes,
        userSubscriptionRoutes_1.UserSubscriptionRoutes,
        projectRoutes_1.ProjectRoutes,
        AdminWalletRoutes_1.AdminWalletRoutes,
        adminSessionRoutes_1.AdminSessionRoutes,
        VideoCallRoutes_1.VideoCallRoutes,
        ReviewRoutes_1.ReviewRoutes,
        ProjectApplicationRoutes_1.ProjectApplicationRoutes,
        InterviewRoutes_1.InterviewRoutes,
        walletRoutes_1.WalletRoutes,
        ReportRoutes_1.ReportRoutes,
        AdminReportRoutes_1.AdminReportRoutes,
        ProjectMessageRoutes_1.ProjectMessageRoutes, Object, notificationRoutes_1.NotificationRoutes,
        CreditPackageRoutes_1.CreditPackageRoutes,
        CreditRoutes_1.CreditRoutes])
], App);
//# sourceMappingURL=server.js.map