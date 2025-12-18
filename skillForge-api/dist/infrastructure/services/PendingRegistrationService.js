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
exports.PendingRegistrationService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../di/types");
const RedisService_1 = require("./RedisService");
let PendingRegistrationService = class PendingRegistrationService {
    constructor(redisService) {
        this.redisService = redisService;
        this.PENDING_REG_PREFIX = 'pending_registration:';
        this.EXPIRY_MINUTES = 15; // 15 minutes to complete OTP verification
    }
    async storePendingRegistration(email, data) {
        const key = this.getPendingRegKey(email);
        const dataString = JSON.stringify(data);
        await this.redisService.set(key, dataString);
        await this.redisService.expire(key, this.EXPIRY_MINUTES * 60);
    }
    async getPendingRegistration(email) {
        const key = this.getPendingRegKey(email);
        const dataString = await this.redisService.get(key);
        if (!dataString) {
            return null;
        }
        try {
            return JSON.parse(dataString);
        }
        catch (error) {
            console.error('Failed to parse pending registration data:', error);
            return null;
        }
    }
    async deletePendingRegistration(email) {
        const key = this.getPendingRegKey(email);
        await this.redisService.delete(key);
    }
    getPendingRegKey(email) {
        return `${this.PENDING_REG_PREFIX}${email.toLowerCase()}`;
    }
};
exports.PendingRegistrationService = PendingRegistrationService;
exports.PendingRegistrationService = PendingRegistrationService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.RedisService)),
    __metadata("design:paramtypes", [RedisService_1.RedisService])
], PendingRegistrationService);
//# sourceMappingURL=PendingRegistrationService.js.map