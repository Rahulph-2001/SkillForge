import { Application } from 'express';
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
import { PassportService } from '../infrastructure/services/PassportService';
import { MCQImportRoutes } from './routes/mcq/MCQImportRoutes';
export declare class App {
    private readonly authRoutes;
    private readonly adminRoutes;
    private readonly publicSubscriptionRoutes;
    private readonly skillRoutes;
    private readonly browseSkillsRoutes;
    private readonly skillTemplateRoutes;
    private readonly publicSkillTemplateRoutes;
    private readonly templateQuestionRoutes;
    private readonly mcqTestRoutes;
    private readonly adminSkillRoutes;
    private readonly bookingRoutes;
    private readonly userProfileRoutes;
    private readonly mcqImportRoutes;
    private readonly passportService;
    private app;
    constructor(authRoutes: AuthRoutes, adminRoutes: AdminRoutes, publicSubscriptionRoutes: PublicSubscriptionRoutes, skillRoutes: SkillRoutes, browseSkillsRoutes: BrowseSkillsRoutes, skillTemplateRoutes: SkillTemplateRoutes, publicSkillTemplateRoutes: PublicSkillTemplateRoutes, templateQuestionRoutes: TemplateQuestionRoutes, mcqTestRoutes: MCQTestRoutes, adminSkillRoutes: AdminSkillRoutes, bookingRoutes: BookingRoutes, userProfileRoutes: UserProfileRoutes, mcqImportRoutes: MCQImportRoutes, passportService: PassportService);
    private setupMiddlewares;
    private setupRoutes;
    private setupErrorHandlers;
    getInstance(): Application;
}
//# sourceMappingURL=server.d.ts.map