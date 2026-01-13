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
exports.AvailabilityController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let AvailabilityController = class AvailabilityController {
    constructor(getUseCase, updateUseCase, getOccupiedSlotsUseCase, responseBuilder) {
        this.getUseCase = getUseCase;
        this.updateUseCase = updateUseCase;
        this.getOccupiedSlotsUseCase = getOccupiedSlotsUseCase;
        this.responseBuilder = responseBuilder;
    }
    async getAvailability(req, res) {
        try {
            const providerId = req.user.userId;
            const availability = await this.getUseCase.execute(providerId);
            const response = this.responseBuilder.success(availability);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', 'Failed to retrieve availability');
            res.status(response.statusCode).json(response.body);
        }
    }
    async updateAvailability(req, res) {
        try {
            const providerId = req.user.userId;
            const data = req.body;
            const updated = await this.updateUseCase.execute(providerId, data);
            const response = this.responseBuilder.success(updated, 'Availability settings updated successfully');
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', 'Failed to update availability');
            res.status(response.statusCode).json(response.body);
        }
    }
    async getOccupiedSlots(req, res) {
        try {
            const { providerId } = req.params;
            const { start, end } = req.query;
            if (!start || !end) {
                const response = this.responseBuilder.error('BAD_REQUEST', 'Start and end dates are required');
                res.status(response.statusCode).json(response.body);
                return;
            }
            const slots = await this.getOccupiedSlotsUseCase.execute(providerId, start, end);
            const response = this.responseBuilder.success(slots);
            res.status(response.statusCode).json(response.body);
        }
        catch (error) {
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', 'Failed to retrieve occupied slots');
            res.status(response.statusCode).json(response.body);
        }
    }
};
exports.AvailabilityController = AvailabilityController;
exports.AvailabilityController = AvailabilityController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IGetProviderAvailabilityUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUpdateProviderAvailabilityUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IGetOccupiedSlotsUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AvailabilityController);
//# sourceMappingURL=AvailabilityController.js.map