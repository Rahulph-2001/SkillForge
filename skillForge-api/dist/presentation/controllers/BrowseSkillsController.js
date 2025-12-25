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
exports.BrowseSkillsController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../domain/enums/HttpStatusCode");
let BrowseSkillsController = class BrowseSkillsController {
    constructor(browseSkillsUseCase, responseBuilder) {
        this.browseSkillsUseCase = browseSkillsUseCase;
        this.responseBuilder = responseBuilder;
        this.browse = async (req, res, next) => {
            try {
                // Extract userId from optional auth middleware
                const userId = req.user?.userId;
                const { search, category, level, minCredits, maxCredits, page, limit, sortBy, sortOrder } = req.query;
                const filters = {
                    search: search,
                    category: category,
                    level: level,
                    minCredits: minCredits ? Number(minCredits) : undefined,
                    maxCredits: maxCredits ? Number(maxCredits) : undefined,
                    page: page ? Number(page) : 1,
                    limit: limit ? Number(limit) : 12,
                    sortBy: sortBy,
                    sortOrder: sortOrder,
                    excludeProviderId: userId, // Exclude current user's skills if authenticated
                };
                const result = await this.browseSkillsUseCase.execute(filters);
                const response = this.responseBuilder.success(result, 'Skills retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.BrowseSkillsController = BrowseSkillsController;
exports.BrowseSkillsController = BrowseSkillsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.BrowseSkillsUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object])
], BrowseSkillsController);
//# sourceMappingURL=BrowseSkillsController.js.map