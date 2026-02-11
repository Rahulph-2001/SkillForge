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
exports.CreditPackageController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const messages_1 = require("../../../config/messages");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
let CreditPackageController = class CreditPackageController {
    constructor(createUseCase, getUseCase, updateUseCase, deleteUseCase, responseBuilder) {
        this.createUseCase = createUseCase;
        this.getUseCase = getUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
        this.responseBuilder = responseBuilder;
        this.create = async (req, res, next) => {
            try {
                const result = await this.createUseCase.execute(req.body);
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.CREDITS.PACKAGE_CREATED, HttpStatusCode_1.HttpStatusCode.CREATED);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.list = async (req, res, next) => {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                const filters = {
                    isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined
                };
                const result = await this.getUseCase.execute(page, limit, filters);
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.CREDITS.PACKAGES_FETCHED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.update = async (req, res, next) => {
            try {
                const { id } = req.params;
                const result = await this.updateUseCase.execute(id, req.body);
                const response = this.responseBuilder.success(result, messages_1.SUCCESS_MESSAGES.CREDITS.PACKAGE_UPDATED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.delete = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.deleteUseCase.execute(id);
                const response = this.responseBuilder.success(null, messages_1.SUCCESS_MESSAGES.CREDITS.PACKAGE_DELETED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.CreditPackageController = CreditPackageController;
exports.CreditPackageController = CreditPackageController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICreateCreditPackageUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IGetCreditPackagesUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IUpdateCreditPackageUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IDeleteCreditPackageUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CreditPackageController);
//# sourceMappingURL=CreditPackageController.js.map