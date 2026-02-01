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
exports.CronScheduler = void 0;
const inversify_1 = require("inversify");
const node_cron_1 = __importDefault(require("node-cron"));
const types_1 = require("../di/types");
let CronScheduler = class CronScheduler {
    constructor(checkSubscriptionExpiryUseCase) {
        this.checkSubscriptionExpiryUseCase = checkSubscriptionExpiryUseCase;
    }
    start() {
        console.log('Starting Cron Scheduler...');
        // Run every day at midnight to check for expired subscriptions
        // Cron format: 0 0 * * * (At 00:00 every day)
        node_cron_1.default.schedule('0 0 * * *', async () => {
            console.log('[Cron] Running daily subscription expiry check...');
            try {
                await this.checkSubscriptionExpiryUseCase.execute();
                console.log('[Cron] Subscription expiry check completed.');
            }
            catch (error) {
                console.error('[Cron] Error running subscription expiry check:', error);
            }
        });
        // Run every hour just in case (optional, for tighter expiry control)
        // cron.schedule('0 * * * *', async () => { ... });
        console.log('Cron Scheduler started successfully.');
    }
};
exports.CronScheduler = CronScheduler;
exports.CronScheduler = CronScheduler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICheckSubscriptionExpiryUseCase)),
    __metadata("design:paramtypes", [Object])
], CronScheduler);
//# sourceMappingURL=CronScheduler.js.map