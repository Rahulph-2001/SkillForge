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
exports.CheckCommunityMembershipExpiryUseCase = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let CheckCommunityMembershipExpiryUseCase = class CheckCommunityMembershipExpiryUseCase {
    constructor(communityRepository, webSocketService, transactionService) {
        this.communityRepository = communityRepository;
        this.webSocketService = webSocketService;
        this.transactionService = transactionService;
    }
    async execute() {
        const now = new Date();
        console.log(`[CheckCommunityMembershipExpiry] Starting expiry check at ${now.toISOString()}`);
        const expiredMemberships = await this.communityRepository.findExpiredMemberships(now);
        if (expiredMemberships.length === 0) {
            console.log('[CheckCommunityMembershipExpiry] No expired memberships found');
            return;
        }
        console.log(`[CheckCommunityMembershipExpiry] Found ${expiredMemberships.length} expired memberships (non-auto-renew)`);
        for (const membership of expiredMemberships) {
            try {
                console.log(`[CheckCommunityMembershipExpiry] Processing expired membership: User ${membership.userId} in Community ${membership.communityId}`);
                await this.transactionService.execute(async (repos) => {
                    membership.expireMembership();
                    await repos.communityRepository.updateMember(membership);
                    console.log(`[CheckCommunityMembershipExpiry] Member marked as inactive`);
                    await repos.communityRepository.decrementMembersCount(membership.communityId);
                    console.log(`[CheckCommunityMembershipExpiry] Member count decremented`);
                });
                console.log(`[CheckCommunityMembershipExpiry] Membership expired successfully for User ${membership.userId}`);
                setImmediate(() => {
                    this.webSocketService.sendToCommunity(membership.communityId, {
                        type: 'member_left',
                        communityId: membership.communityId,
                        data: {
                            userId: membership.userId,
                            userName: membership.userName || 'Unknown User',
                            reason: 'subscription_expired',
                            timestamp: now.toISOString(),
                        },
                    });
                    this.webSocketService.sendToUser(membership.userId, {
                        type: 'member_removed',
                        communityId: membership.communityId,
                        data: {
                            communityId: membership.communityId,
                            message: 'Your subscription has expired. Please renew to continue accessing this community.',
                            reason: 'subscription_expired',
                            timestamp: now.toISOString(),
                        },
                    });
                    console.log(`[CheckCommunityMembershipExpiry] WebSocket notifications sent for User ${membership.userId}`);
                });
            }
            catch (error) {
                console.error(`[CheckCommunityMembershipExpiry] Failed to expire membership for User ${membership.userId} in Community ${membership.communityId}:`, error);
            }
        }
        console.log(`[CheckCommunityMembershipExpiry] Expiry check completed. Processed ${expiredMemberships.length} memberships`);
    }
};
exports.CheckCommunityMembershipExpiryUseCase = CheckCommunityMembershipExpiryUseCase;
exports.CheckCommunityMembershipExpiryUseCase = CheckCommunityMembershipExpiryUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IWebSocketService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ITransactionService)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CheckCommunityMembershipExpiryUseCase);
//# sourceMappingURL=CheckCommunityMembershipExpiryUseCase.js.map