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
exports.InterviewScheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const inversify_1 = require("inversify");
const types_1 = require("../di/types");
let InterviewScheduler = class InterviewScheduler {
    constructor(interviewRepository) {
        this.interviewRepository = interviewRepository;
    }
    start() {
        // Run every minute
        node_cron_1.default.schedule('* * * * *', async () => {
            console.log('[InterviewScheduler] Checking for expired interviews...');
            try {
                const expiredCandidates = await this.interviewRepository.findExpiredInterviews();
                const now = new Date();
                for (const interview of expiredCandidates) {
                    const durationMs = interview.durationMinutes * 60 * 1000;
                    const endTime = new Date(interview.scheduledAt.getTime() + durationMs);
                    // If current time is past the end time (plus buffer if needed, but let's say strict end)
                    if (now > endTime) {
                        interview.complete();
                        await this.interviewRepository.update(interview);
                        console.log(`[InterviewScheduler] Marked interview ${interview.id} as COMPLETED`);
                    }
                }
            }
            catch (error) {
                console.error('[InterviewScheduler] Error checking interviews:', error);
            }
        });
        console.log('[InterviewScheduler] Service started');
    }
};
exports.InterviewScheduler = InterviewScheduler;
exports.InterviewScheduler = InterviewScheduler = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IInterviewRepository)),
    __metadata("design:paramtypes", [Object])
], InterviewScheduler);
//# sourceMappingURL=InterviewScheduler.js.map