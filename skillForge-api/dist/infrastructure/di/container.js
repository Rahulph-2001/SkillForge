"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const di_1 = require("./di");
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return di_1.container; } });
const types_1 = require("./types");
const server_1 = require("../../presentation/server");
// Import all binding modules
const repository_bindings_1 = require("./modules/repository.bindings");
const service_bindings_1 = require("./modules/service.bindings");
const mapper_bindings_1 = require("./modules/mapper.bindings");
const auth_bindings_1 = require("./modules/auth.bindings");
const user_bindings_1 = require("./modules/user.bindings");
const booking_bindings_1 = require("./modules/booking.bindings");
const skill_bindings_1 = require("./modules/skill.bindings");
const subscription_bindings_1 = require("./modules/subscription.bindings");
const payment_bindings_1 = require("./modules/payment.bindings");
const community_bindings_1 = require("./modules/community.bindings");
const admin_bindings_1 = require("./modules/admin.bindings");
const project_bindings_1 = require("./modules/project.bindings");
const adminSession_bindings_1 = require("./modules/adminSession.bindings");
const escrow_bindings_1 = require("./modules/escrow.bindings");
const videoCall_bindings_1 = require("./modules/videoCall.bindings");
const review_bindings_1 = require("./modules/review.bindings");
const projectApplication_bindings_1 = require("./modules/projectApplication.bindings");
const interview_bindings_1 = require("./modules/interview.bindings");
const CronScheduler_1 = require("../scheduler/CronScheduler");
// Bind all modules in dependency order
// 1. Core infrastructure (repositories, services, mappers)
(0, repository_bindings_1.bindRepositoryModule)(di_1.container);
(0, service_bindings_1.bindServiceModule)(di_1.container);
(0, mapper_bindings_1.bindMapperModule)(di_1.container);
// 2. Feature modules
(0, auth_bindings_1.bindAuthModule)(di_1.container);
(0, user_bindings_1.bindUserModule)(di_1.container);
(0, booking_bindings_1.bindBookingModule)(di_1.container);
(0, skill_bindings_1.bindSkillModule)(di_1.container);
(0, subscription_bindings_1.bindSubscriptionModule)(di_1.container);
(0, payment_bindings_1.bindPaymentModule)(di_1.container);
(0, community_bindings_1.bindCommunityModule)(di_1.container);
(0, admin_bindings_1.bindAdminModule)(di_1.container);
(0, project_bindings_1.bindProjectModule)(di_1.container);
(0, adminSession_bindings_1.bindAdminSessionModule)(di_1.container);
(0, videoCall_bindings_1.registerVideoCallBindings)(di_1.container);
(0, review_bindings_1.registerReviewBindings)(di_1.container);
(0, projectApplication_bindings_1.registerProjectApplicationBindings)(di_1.container);
(0, interview_bindings_1.registerInterviewBindings)(di_1.container);
di_1.container.bind(types_1.TYPES.CronScheduler).to(CronScheduler_1.CronScheduler).inSingletonScope();
di_1.container.load(escrow_bindings_1.escrowModule);
// 3. Application entry point
di_1.container.bind(types_1.TYPES.App).to(server_1.App);
//# sourceMappingURL=container.js.map