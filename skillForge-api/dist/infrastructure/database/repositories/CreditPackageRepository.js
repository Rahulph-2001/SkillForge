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
exports.CreditPackageRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const Database_1 = require("../Database");
const BaseRepository_1 = require("../BaseRepository");
const CreditPackage_1 = require("../../../domain/entities/CreditPackage");
let CreditPackageRepository = class CreditPackageRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'creditPackage');
    }
    async create(entity) {
        const data = await this.prisma.creditPackage.create({
            data: {
                credits: entity.credits,
                price: entity.price,
                isPopular: entity.isPopular,
                isActive: entity.isActive,
                discount: entity.discount,
                isDeleted: entity.isDeleted,
            },
        });
        return this.toDomain(data);
    }
    async findById(id) {
        const data = await this.prisma.creditPackage.findUnique({
            where: { id, isDeleted: false },
        });
        return data ? this.toDomain(data) : null;
    }
    async findPackages(filters, skip, take) {
        const where = { isDeleted: false };
        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        const [data, total] = await Promise.all([
            this.prisma.creditPackage.findMany({
                where,
                orderBy: { price: 'asc' },
                skip,
                take,
            }),
            this.prisma.creditPackage.count({ where })
        ]);
        return {
            data: data.map((item) => this.toDomain(item)),
            total
        };
    }
    async update(entity) {
        const data = await this.prisma.creditPackage.update({
            where: { id: entity.id },
            data: {
                credits: entity.credits,
                price: entity.price,
                isPopular: entity.isPopular,
                isActive: entity.isActive,
                discount: entity.discount,
                isDeleted: entity.isDeleted,
            },
        });
        return this.toDomain(data);
    }
    async findActivePackages() {
        const packages = await this.prisma.creditPackage.findMany({
            where: {
                isActive: true,
                isDeleted: false,
            },
            orderBy: [
                { isPopular: 'desc' },
                { credits: 'asc' },
            ],
        });
        return packages.map(pkg => new CreditPackage_1.CreditPackage({
            id: pkg.id,
            credits: pkg.credits,
            price: Number(pkg.price),
            isPopular: pkg.isPopular,
            isActive: pkg.isActive,
            discount: pkg.discount,
            createdAt: pkg.createdAt,
            updatedAt: pkg.updatedAt,
            isDeleted: pkg.isDeleted,
        }));
    }
    async delete(id) {
        await this.prisma.creditPackage.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
    toDomain(data) {
        return new CreditPackage_1.CreditPackage({
            id: data.id,
            credits: data.credits,
            price: Number(data.price),
            isPopular: data.isPopular,
            isActive: data.isActive,
            discount: data.discount,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            isDeleted: data.isDeleted,
        });
    }
};
exports.CreditPackageRepository = CreditPackageRepository;
exports.CreditPackageRepository = CreditPackageRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], CreditPackageRepository);
//# sourceMappingURL=CreditPackageRepository.js.map