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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessAutoRenewMembershipsUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let ProcessAutoRenewMembershipsUseCase = class ProcessAutoRenewMembershipsUseCase {
    constructor(communityRepository, userRepository, webSocketService, transactionService) {
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
        this.webSocketService = webSocketService;
        this.transactionService = transactionService;
    }
    async execute() {
        const now = new Date();
        console.log(`[ProcessAutoRenew] Starting auto-renew check at ${now.toISOString()}`);
        const expiredAutoRenewMembers = await this.communityRepository.findExpiredMembershipsWithAutoRenew(now);
        if (expiredAutoRenewMembers.length === 0) {
            console.log('[ProcessAutoRenew] No expired auto-renew memberships found');
            return;
        }
        console.log(`[ProcessAutoRenew] Found ${expiredAutoRenewMembers.length} expired auto-renew memberships`);
        for (const membership of expiredAutoRenewMembers) {
            try {
                const memberAny = membership;
                const userCredits = memberAny._userCredits;
                const communityCost = memberAny._communityCost;
                const communityAdminId = memberAny._communityAdminId;
                const communityName = memberAny._communityName;
                console.log(`[ProcessAutoRenew] Processing: User ${membership.userId} in Community ${membership.communityId}`);
                console.log(`[ProcessAutoRenew] User credits: ${userCredits}, Cost: ${communityCost}`);
                if (userCredits >= communityCost) {
                    await this.processSuccessfulRenewal(membership, communityCost, communityAdminId, communityName, now);
                }
                else {
                    await this.processFailedRenewal(membership, now);
                }
            }
            catch (error) {
                console.error(`[ProcessAutoRenew] Failed for User ${membership.userId}:`, error);
            }
        }
        console.log(`[ProcessAutoRenew] Completed. Processed ${expiredAutoRenewMembers.length} memberships`);
    }
    async processSuccessfulRenewal(membership, cost, adminId, communityName, now) {
        await this.transactionService.execute(async (repos) => {
            const user = await repos.userRepository.findById(membership.userId);
            if (!user)
                throw new Error('User not found');
            user.deductCredits(cost);
            await repos.userRepository.update(user);
            console.log(`[ProcessAutoRenew] Deducted ${cost} credits from user ${membership.userId}`);
            if (cost > 0 && adminId !== membership.userId) {
                const admin = await repos.userRepository.findById(adminId);
                if (admin) {
                    admin.addCredits(cost, 'earned');
                    await repos.userRepository.update(admin);
                    console.log(`[ProcessAutoRenew] Credited ${cost} to admin ${adminId}`);
                }
            }
            membership.renewSubscription(30);
            await repos.communityRepository.updateMember(membership);
            console.log(`[ProcessAutoRenew] Renewed subscription for user ${membership.userId}`);
        });
        setImmediate(() => {
            this.webSocketService.sendToUser(membership.userId, {
                type: 'subscription_renewed',
                communityId: membership.communityId,
                data: {
                    communityId: membership.communityId,
                    communityName: communityName,
                    message: `Your subscription to ${communityName} has been automatically renewed for 30 days.`,
                    creditsDeducted: cost,
                    newExpiryDate: membership.subscriptionEndsAt,
                    timestamp: now.toISOString(),
                },
            });
            this.webSocketService.sendToUser(membership.userId, {
                type: 'balance_updated',
                data: {
                    timestamp: now.toISOString(),
                },
            });
            console.log(`[ProcessAutoRenew] Sent renewal success notification to user ${membership.userId}`);
        });
    }
    async processFailedRenewal(membership, now) {
        const communityName = membership._communityName;
        await this.transactionService.execute(async (repos) => {
            membership.expireMembership();
            await repos.communityRepository.updateMember(membership);
            await repos.communityRepository.decrementMembersCount(membership.communityId);
            console.log(`[ProcessAutoRenew] Removed user ${membership.userId} - insufficient credits`);
        });
        setImmediate(() => {
            this.webSocketService.sendToCommunity(membership.communityId, {
                type: 'member_left',
                communityId: membership.communityId,
                data: {
                    userId: membership.userId,
                    userName: membership.userName || 'Unknown User',
                    reason: 'auto_renew_failed',
                    timestamp: now.toISOString(),
                },
            });
            this.webSocketService.sendToUser(membership.userId, {
                type: 'member_removed',
                communityId: membership.communityId,
                data: {
                    communityId: membership.communityId,
                    communityName: communityName,
                    message: `Your subscription to ${communityName} could not be renewed due to insufficient credits. You have been removed from the community.`,
                    reason: 'auto_renew_failed',
                    timestamp: now.toISOString(),
                },
            });
            console.log(`[ProcessAutoRenew] Sent removal notification to user ${membership.userId}`);
        });
    }
};
exports.ProcessAutoRenewMembershipsUseCase = ProcessAutoRenewMembershipsUseCase;
exports.ProcessAutoRenewMembershipsUseCase = ProcessAutoRenewMembershipsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IWebSocketService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.ITransactionService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ProcessAutoRenewMembershipsUseCase);
//# sourceMappingURL=ProcessAutoRenewMembershipsUseCase.js.map