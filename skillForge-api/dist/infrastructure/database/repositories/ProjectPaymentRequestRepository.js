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
exports.ProjectPaymentRequestRepository = void 0;
const inversify_1 = require("inversify");
const client_1 = require("@prisma/client");
const types_1 = require("../../di/types");
const ProjectPaymentRequest_1 = require("../../../domain/entities/ProjectPaymentRequest");
let ProjectPaymentRequestRepository = class ProjectPaymentRequestRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(request) {
        const data = request.toObject();
        // Convert domain enums to string/Prisma enums if necessary, 
        // but Prisma client usually handles matching string enums well if they match.
        // However, since we haven't successfully run prisma generate yet, 
        // we need to be careful. The Prisma types will be updated after generation.
        const created = await this.prisma.projectPaymentRequest.create({
            data: {
                id: data.id,
                projectId: data.projectId,
                type: data.type, // Cast to any to avoid type error before regeneration
                amount: data.amount,
                requestedBy: data.requestedBy,
                recipientId: data.recipientId,
                status: data.status,
                adminNotes: data.adminNotes,
                processedAt: data.processedAt,
                processedBy: data.processedBy,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            },
        });
        return ProjectPaymentRequest_1.ProjectPaymentRequest.fromDatabaseRow(created);
    }
    async findById(id) {
        const found = await this.prisma.projectPaymentRequest.findUnique({
            where: { id },
        });
        if (!found)
            return null;
        return ProjectPaymentRequest_1.ProjectPaymentRequest.fromDatabaseRow(found);
    }
    async findByProjectId(projectId) {
        const results = await this.prisma.projectPaymentRequest.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
        });
        return results.map(row => ProjectPaymentRequest_1.ProjectPaymentRequest.fromDatabaseRow(row));
    }
    async findPending() {
        const results = await this.prisma.projectPaymentRequest.findMany({
            where: { status: 'PENDING' },
            orderBy: { createdAt: 'asc' },
            include: {
                project: {
                    select: {
                        title: true,
                        budget: true,
                    }
                }
            }
        });
        return results.map(row => ProjectPaymentRequest_1.ProjectPaymentRequest.fromDatabaseRow(row));
    }
    async findPendingByType(type) {
        const results = await this.prisma.projectPaymentRequest.findMany({
            where: {
                status: 'PENDING',
                type: type
            },
            orderBy: { createdAt: 'asc' },
        });
        return results.map(row => ProjectPaymentRequest_1.ProjectPaymentRequest.fromDatabaseRow(row));
    }
    async update(request) {
        const data = request.toObject();
        const updated = await this.prisma.projectPaymentRequest.update({
            where: { id: data.id },
            data: {
                status: data.status,
                adminNotes: data.adminNotes,
                processedAt: data.processedAt,
                processedBy: data.processedBy,
                updatedAt: data.updatedAt,
            },
        });
        return ProjectPaymentRequest_1.ProjectPaymentRequest.fromDatabaseRow(updated);
    }
};
exports.ProjectPaymentRequestRepository = ProjectPaymentRequestRepository;
exports.ProjectPaymentRequestRepository = ProjectPaymentRequestRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], ProjectPaymentRequestRepository);
//# sourceMappingURL=ProjectPaymentRequestRepository.js.map