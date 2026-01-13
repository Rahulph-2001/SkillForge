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
exports.PublicSubscriptionController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
let PublicSubscriptionController = class PublicSubscriptionController {
    constructor(listPublicPlansUseCase, responseBuilder) {
        this.listPublicPlansUseCase = listPublicPlansUseCase;
        this.responseBuilder = responseBuilder;
    }
    async listPlans(_req, res, next) {
        try {
            // No authentication required - public endpoint
            const result = await this.listPublicPlansUseCase.execute();
            const response = this.responseBuilder.success(result, 'Subscription plans retrieved successfully');
            res.status(response.statusCode).json(response);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.PublicSubscriptionController = PublicSubscriptionController;
exports.PublicSubscriptionController = PublicSubscriptionController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IListPublicSubscriptionPlansUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object])
], PublicSubscriptionController);
//# sourceMappingURL=PublicSubscriptionController.js.map