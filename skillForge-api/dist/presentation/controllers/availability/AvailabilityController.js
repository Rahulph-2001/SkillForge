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
const GetProviderAvailabilityUseCase_1 = require("../../../application/useCases/availability/GetProviderAvailabilityUseCase");
const UpdateProviderAvailabilityUseCase_1 = require("../../../application/useCases/availability/UpdateProviderAvailabilityUseCase");
let AvailabilityController = class AvailabilityController {
    constructor(getUseCase, updateUseCase, responseBuilder) {
        this.getUseCase = getUseCase;
        this.updateUseCase = updateUseCase;
        this.responseBuilder = responseBuilder;
    }
    async getAvailability(req, res) {
        try {
            const providerId = req.user.userId; // Assumes auth middleware populates user
            const availability = await this.getUseCase.execute(providerId);
            res.status(200).json(this.responseBuilder.success(availability));
        }
        catch (error) {
            console.error('Error getting availability:', error);
            res.status(500).json(this.responseBuilder.error('INTERNAL_SERVER_ERROR', 'Failed to retrieve availability'));
        }
    }
    async updateAvailability(req, res) {
        try {
            const providerId = req.user.userId;
            const data = req.body;
            console.log(`[AvailabilityController] Updating availability for provider ${providerId}:`, JSON.stringify(data, null, 2));
            const updated = await this.updateUseCase.execute(providerId, data);
            res.status(200).json(this.responseBuilder.success(updated, 'Availability settings updated successfully'));
        }
        catch (error) {
            console.error('Error updating availability:', error);
            res.status(500).json(this.responseBuilder.error('INTERNAL_SERVER_ERROR', 'Failed to update availability'));
        }
    }
};
exports.AvailabilityController = AvailabilityController;
exports.AvailabilityController = AvailabilityController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.GetProviderAvailabilityUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UpdateProviderAvailabilityUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [GetProviderAvailabilityUseCase_1.GetProviderAvailabilityUseCase,
        UpdateProviderAvailabilityUseCase_1.UpdateProviderAvailabilityUseCase, Object])
], AvailabilityController);
//# sourceMappingURL=AvailabilityController.js.map