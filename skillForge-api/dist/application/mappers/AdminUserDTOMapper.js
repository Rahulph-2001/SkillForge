"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserDTOMapper = void 0;
const inversify_1 = require("inversify");
let AdminUserDTOMapper = class AdminUserDTOMapper {
    toDTO(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email.value,
            role: user.role,
            credits: user.credits,
            isActive: user.isActive,
            isDeleted: user.isDeleted,
            emailVerified: user.verification.email_verified,
            avatarUrl: user.avatarUrl
        };
    }
};
exports.AdminUserDTOMapper = AdminUserDTOMapper;
exports.AdminUserDTOMapper = AdminUserDTOMapper = __decorate([
    (0, inversify_1.injectable)()
], AdminUserDTOMapper);
//# sourceMappingURL=AdminUserDTOMapper.js.map