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
exports.TransactionService = void 0;
// skillForge-api/src/infrastructure/services/TransactionService.ts
const inversify_1 = require("inversify");
const types_1 = require("../di/types");
const Database_1 = require("../database/Database");
const UserRepository_1 = require("../database/repositories/UserRepository");
const CommunityRepository_1 = require("../database/repositories/CommunityRepository");
const UsageRecordRepository_1 = require("../database/repositories/UsageRecordRepository");
let TransactionService = class TransactionService {
    constructor(database) {
        this.database = database;
    }
    async execute(callback) {
        return await this.database.transaction(async (tx) => {
            // Create repository instances and inject transaction client
            // This ensures all operations within the callback use the same transaction
            const userRepository = new UserRepository_1.UserRepository(this.database);
            userRepository.setTransactionClient(tx);
            const communityRepository = new CommunityRepository_1.CommunityRepository(this.database);
            communityRepository.setTransactionClient(tx);
            const usageRecordRepository = new UsageRecordRepository_1.UsageRecordRepository(this.database);
            usageRecordRepository.setTransactionClient(tx);
            const repositories = {
                userRepository,
                communityRepository,
                usageRecordRepository,
            };
            return await callback(repositories);
        });
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], TransactionService);
//# sourceMappingURL=TransactionService.js.map