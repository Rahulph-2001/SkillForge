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
const rateLimitMiddileWare_1 = require("./middlewares/rateLimitMiddileWare");
const PassportService_1 = require("../infrastructure/services/PassportService");
const MCQImportRoutes_1 = require("./routes/mcq/MCQImportRoutes");
const availabilityRoutes_1 = require("./routes/availability/availabilityRoutes");
const communityRoutes_1 = require("./routes/community/communityRoutes");
const paymentRoutes_1 = require("./routes/payment/paymentRoutes");
const userSubscriptionRoutes_1 = require("./routes/subscription/userSubscriptionRoutes");
let App = class App {
    constructor(authRoutes, adminRoutes, publicSubscriptionRoutes, skillRoutes, browseSkillsRoutes, skillTemplateRoutes, publicSkillTemplateRoutes, templateQuestionRoutes, mcqTestRoutes, adminSkillRoutes, bookingRoutes, userProfileRoutes, mcqImportRoutes, availabilityRoutes, communityRoutes, paymentRoutes, userSubscriptionRoutes, passportService) {
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
        this.passportService = passportService;
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
        this.app.get('/api/v1/health', (_req, res) => {
            res.status(HttpStatusCode_1.HttpStatusCode.OK).json({ status: 'UP', service: 'SkillSwap API' });
        });
        this.app.use('/api/v1', rateLimitMiddileWare_1.generalLimiter);
    }
    setupRoutes() {
        this.app.use('/api/v1/auth', this.authRoutes.router);
        this.app.use('/api/v1/subscriptions', this.publicSubscriptionRoutes.router);
        this.app.use('/api/v1/profile', this.userProfileRoutes.getRouter());
        this.app.use('/api/v1/users', userProfileRoutes_2.default);
        // IMPORTANT: Specific routes MUST come before parameterized routes
        // /skills/me must be registered before /skills/:skillId
        this.app.use('/api/v1/skills', this.skillRoutes.router);
        this.app.use('/api/v1/skills', this.browseSkillsRoutes.getRouter());
        this.app.use('/api/v1/skill-templates', this.publicSkillTemplateRoutes.router);
        this.app.use('/api/v1/mcq', this.mcqTestRoutes.getRouter());
        this.app.use('/api/v1/bookings', this.bookingRoutes.router);
        this.app.use('/api/v1/sessions', sessionManagementRoutes_1.default);
        this.app.use('/api/v1/admin', this.adminRoutes.router);
        this.app.use('/api/v1/admin/skills', this.adminSkillRoutes.getRouter());
        this.app.use('/api/v1/admin/skill-templates', this.skillTemplateRoutes.router);
        this.app.use('/api/v1/admin/skill-templates/:templateId/questions', this.templateQuestionRoutes.router);
        this.app.use('/api/v1/admin/mcq', this.mcqImportRoutes.getRouter());
        this.app.use('/api/v1/availability', this.availabilityRoutes.router);
        this.app.use('/api/v1/communities', this.communityRoutes.getRouter());
        this.app.use('/api/v1/payments', this.paymentRoutes.getRouter());
        this.app.use('/api/v1/subscriptions', this.userSubscriptionRoutes.router);
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
    __param(17, (0, inversify_1.inject)(types_1.TYPES.PassportService)),
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
        PassportService_1.PassportService])
], App);
//# sourceMappingURL=server.js.map