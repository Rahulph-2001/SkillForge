/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { IInterviewRepository } from '../../../domain/repositories/IInterviewRepository';
import { Interview, InterviewStatus } from '../../../domain/entities/Interview';
import { PrismaClient } from '@prisma/client';

@injectable()
export class InterviewRepository extends BaseRepository<Interview> implements IInterviewRepository {
    constructor(@inject(TYPES.Database) db: Database) {
        super(db, 'interview');
    }

    async create(interview: Interview): Promise<Interview> {
        const prisma = this.prisma as PrismaClient;
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

    async findById(id: string): Promise<Interview | null> {
        const prisma = this.prisma as PrismaClient;
        const data = await prisma.interview.findUnique({
            where: { id },
        });
        return data ? this.toDomain(data) : null;
    }

    async findByApplicationId(applicationId: string): Promise<Interview[]> {
        const prisma = this.prisma as PrismaClient;
        const data = await prisma.interview.findMany({
            where: { applicationId },
            orderBy: { scheduledAt: 'desc' },
        });
        return data.map((d) => this.toDomain(d));
    }

    async update(interview: Interview): Promise<Interview> {
        const prisma = this.prisma as PrismaClient;
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

    async findExpiredInterviews(): Promise<Interview[]> {
        const prisma = this.prisma as PrismaClient;
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
        return data.map((d) => this.toDomain(d));
    }

    private toDomain(data: Record<string, unknown>): Interview {
        return new Interview({
            id: data.id as string | undefined,
            applicationId: data.applicationId as string,
            scheduledAt: data.scheduledAt as Date,
            durationMinutes: data.durationMinutes,
            status: data.status as InterviewStatus,
            meetingLink: data.meetingLink as string | null | undefined,
            createdAt: data.createdAt as Date | undefined,
            updatedAt: data.updatedAt as Date | undefined,
        });
    }
}
