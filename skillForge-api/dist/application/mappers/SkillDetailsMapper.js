"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillDetailsMapper = void 0;
const inversify_1 = require("inversify");
let SkillDetailsMapper = class SkillDetailsMapper {
    toDTO(skill, provider, providerStats, availability) {
        return {
            id: skill.id,
            title: skill.title,
            description: skill.description,
            category: skill.category,
            level: skill.level,
            durationHours: skill.durationHours,
            creditsPerHour: skill.creditsPerHour,
            imageUrl: skill.imageUrl,
            tags: skill.tags,
            rating: skill.rating,
            totalSessions: skill.totalSessions,
            provider: {
                id: provider.id,
                name: provider.name,
                email: provider.email.value,
                rating: providerStats.rating,
                reviewCount: providerStats.reviewCount,
            },
            availability: availability ? {
                weeklySchedule: availability.weeklySchedule,
                blockedDates: availability.blockedDates,
                timezone: availability.timezone,
                bookedSlots: availability.bookedSlots // Map this field!
            } : null
        };
    }
};
exports.SkillDetailsMapper = SkillDetailsMapper;
exports.SkillDetailsMapper = SkillDetailsMapper = __decorate([
    (0, inversify_1.injectable)()
], SkillDetailsMapper);
//# sourceMappingURL=SkillDetailsMapper.js.map