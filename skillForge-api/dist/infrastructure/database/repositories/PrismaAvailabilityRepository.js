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
exports.PrismaAvailabilityRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const Database_1 = require("../../database/Database");
const ProviderAvailability_1 = require("../../../domain/entities/ProviderAvailability");
let PrismaAvailabilityRepository = class PrismaAvailabilityRepository {
    constructor(database) {
        this.database = database;
    }
    async findByProviderId(providerId) {
        const data = await this.database.getClient().providerAvailability.findUnique({
            where: { providerId },
        });
        if (!data)
            return null;
        return this.mapToEntity(data);
    }
    async findByProviderIds(providerIds) {
        const data = await this.database.getClient().providerAvailability.findMany({
            where: {
                providerId: { in: providerIds }
            }
        });
        return data.map(item => this.mapToEntity(item));
    }
    async create(availability) {
        const data = await this.database.getClient().providerAvailability.create({
            data: {
                providerId: availability.providerId,
                weeklySchedule: availability.weeklySchedule,
                timezone: availability.timezone,
                bufferTime: availability.bufferTime,
                minAdvanceBooking: availability.minAdvanceBooking,
                maxAdvanceBooking: availability.maxAdvanceBooking,
                autoAccept: availability.autoAccept,
                blockedDates: availability.blockedDates,
                maxSessionsPerDay: availability.maxSessionsPerDay,
            },
        });
        return this.mapToEntity(data);
    }
    async update(providerId, availability) {
        const data = await this.database.getClient().providerAvailability.update({
            where: { providerId },
            data: {
                weeklySchedule: availability.weeklySchedule,
                timezone: availability.timezone,
                bufferTime: availability.bufferTime,
                minAdvanceBooking: availability.minAdvanceBooking,
                maxAdvanceBooking: availability.maxAdvanceBooking,
                autoAccept: availability.autoAccept,
                blockedDates: availability.blockedDates,
                maxSessionsPerDay: availability.maxSessionsPerDay,
            },
        });
        return this.mapToEntity(data);
    }
    mapToEntity(data) {
        return new ProviderAvailability_1.ProviderAvailability(data.id, data.providerId, data.weeklySchedule, data.timezone, data.bufferTime, data.minAdvanceBooking, data.maxAdvanceBooking, data.autoAccept, data.blockedDates, data.maxSessionsPerDay, data.createdAt, data.updatedAt);
    }
};
exports.PrismaAvailabilityRepository = PrismaAvailabilityRepository;
exports.PrismaAvailabilityRepository = PrismaAvailabilityRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], PrismaAvailabilityRepository);
//# sourceMappingURL=PrismaAvailabilityRepository.js.map