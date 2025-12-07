"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanMapper = void 0;
const inversify_1 = require("inversify");
let SubscriptionPlanMapper = class SubscriptionPlanMapper {
    toDTO(plan) {
        return {
            id: plan.id,
            name: plan.name,
            price: plan.price,
            projectPosts: plan.projectPosts,
            communityPosts: plan.communityPosts,
            features: plan.features,
            badge: plan.badge,
            color: plan.color,
            isActive: plan.isActive,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt,
        };
    }
};
exports.SubscriptionPlanMapper = SubscriptionPlanMapper;
exports.SubscriptionPlanMapper = SubscriptionPlanMapper = __decorate([
    (0, inversify_1.injectable)()
], SubscriptionPlanMapper);
//# sourceMappingURL=SubscriptionPlanMapper.js.map