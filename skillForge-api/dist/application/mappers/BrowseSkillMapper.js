"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowseSkillMapper = void 0;
const inversify_1 = require("inversify");
let BrowseSkillMapper = class BrowseSkillMapper {
    toDTO(skill, provider, availability) {
        let availableDays = [];
        if (availability && availability.weeklySchedule) {
            availableDays = Object.entries(availability.weeklySchedule)
                .filter(([_, schedule]) => schedule.enabled)
                .map(([day, schedule]) => {
                if (schedule.slots && schedule.slots.length > 0) {
                    const slot = schedule.slots[0];
                    const formatTime = (time) => {
                        const [h, m] = time.split(':');
                        const hour = parseInt(h);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const hour12 = hour % 12 || 12;
                        return `${hour12}:${m} ${ampm}`;
                    };
                    return `${day} (${formatTime(slot.start)} - ${formatTime(slot.end)})`;
                }
                return day;
            });
        }
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
            },
            availableDays
        };
    }
};
exports.BrowseSkillMapper = BrowseSkillMapper;
exports.BrowseSkillMapper = BrowseSkillMapper = __decorate([
    (0, inversify_1.injectable)()
], BrowseSkillMapper);
//# sourceMappingURL=BrowseSkillMapper.js.map