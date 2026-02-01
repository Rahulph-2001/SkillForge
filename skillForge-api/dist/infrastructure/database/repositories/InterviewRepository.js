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
exports.InterviewRepository = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../di/types");
const Database_1 = require("../Database");
const BaseRepository_1 = require("../BaseRepository");
const Interview_1 = require("../../../domain/entities/Interview");
let InterviewRepository = class InterviewRepository extends BaseRepository_1.BaseRepository {
    constructor(db) {
        super(db, 'interview');
    }
    async create(interview) {
        const prisma = this.prisma;
        const data = await prisma.interview.create({
            data: {
                id: interview.id,
                applicationId: interview.applicationId,
                scheduledAt: interview.scheduledAt,
                durationMinutes: interview.durationMinutes,
                status: interview.status,
                meetingLink: interview.meetingLink,
                createdAt: interview.createdAt,
                updatedAt: interview.updatedAt,
            },
        });
        return this.toDomain(data);
    }
    async findById(id) {
        const prisma = this.prisma;
        const data = await prisma.interview.findUnique({
            where: { id },
        });
        return data ? this.toDomain(data) : null;
    }
    async findByApplicationId(applicationId) {
        const prisma = this.prisma;
        const data = await prisma.interview.findMany({
            where: { applicationId },
            orderBy: { scheduledAt: 'desc' },
        });
        return data.map(d => this.toDomain(d));
    }
    async update(interview) {
        const prisma = this.prisma;
        const data = await prisma.interview.update({
            where: { id: interview.id },
            data: {
                scheduledAt: interview.scheduledAt,
                durationMinutes: interview.durationMinutes,
                status: interview.status,
                meetingLink: interview.meetingLink,
                updatedAt: interview.updatedAt,
            },
        });
        return this.toDomain(data);
    }
    async findExpiredInterviews() {
        const prisma = this.prisma;
        const now = new Date();
        // Fetch all scheduled interviews that started before now
        // We will filter strictly expired ones in the scheduler or here
        const data = await prisma.interview.findMany({
            where: {
                status: 'SCHEDULED',
                scheduledAt: {
                    lt: now
                }
            }
        });
        return data.map(d => this.toDomain(d));
    }
    toDomain(data) {
        return new Interview_1.Interview({
            id: data.id,
            applicationId: data.applicationId,
            scheduledAt: data.scheduledAt,
            durationMinutes: data.durationMinutes,
            status: data.status,
            meetingLink: data.meetingLink,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        });
    }
};
exports.InterviewRepository = InterviewRepository;
exports.InterviewRepository = InterviewRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Database)),
    __metadata("design:paramtypes", [Database_1.Database])
], InterviewRepository);
//# sourceMappingURL=InterviewRepository.js.map