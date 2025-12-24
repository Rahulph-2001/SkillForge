import { injectable, inject } from 'inversify';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { Database } from '../Database';
import { TYPES } from '../../di/types';
import { BrowseSkillsRequestDTO } from '../../../application/dto/skill/BrowseSkillsRequestDTO';

@injectable()
export class SkillRepository implements ISkillRepository {
  private readonly prisma;

  constructor(@inject(TYPES.Database) db: Database) {
    this.prisma = db.getClient();
  }

  async browse(filters: BrowseSkillsRequestDTO): Promise<{ skills: Skill[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: 'approved',
      isBlocked: false,
      isAdminBlocked: false,
      isDeleted: false,
      verificationStatus: 'passed',
    };

    // Search filter
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { hasSome: [filters.search] } },
      ];
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      where.category = { contains: filters.category, mode: 'insensitive' };
    }

    // Level filter
    if (filters.level) {
      where.level = filters.level;
    }

    // Credits filter (changed from price)
    if (filters.minCredits !== undefined || filters.maxCredits !== undefined) {
      where.creditsPerHour = {};
      if (filters.minCredits !== undefined) {
        where.creditsPerHour.gte = filters.minCredits;
      }
      if (filters.maxCredits !== undefined) {
        where.creditsPerHour.lte = filters.maxCredits;
      }
    }

    // Get total count
    const total = await this.prisma.skill.count({ where });

    // Get skills
    const skills = await this.prisma.skill.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    return {
      skills: skills.map((s: any) => this.toDomain(s)),
      total
    };
  }

  async findPending(): Promise<Skill[]> {
    const skills = await this.prisma.skill.findMany({
      where: {
        status: 'in-review',
        verificationStatus: 'passed',
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return skills.map((s: any) => this.toDomain(s));
  }

  async update(skill: Skill): Promise<Skill> {
    const data = skill.toJSON();
    const updated = await this.prisma.skill.update({
      where: { id: skill.id },
      data: {
        title: data.title as string,
        description: data.description as string,
        category: data.category as string,
        level: data.level as string,
        durationHours: data.durationHours as number,
        creditsPerHour: data.creditsPerHour as number,
        tags: data.tags as string[],
        imageUrl: data.imageUrl as string | null,
        status: data.status as string,
        verificationStatus: data.verificationStatus as string | null,
        mcqScore: data.mcqScore as number | null,
        mcqTotalQuestions: data.mcqTotalQuestions as number | null,
        mcqPassingScore: data.mcqPassingScore as number | null,
        verifiedAt: data.verifiedAt as Date | null,
        totalSessions: data.totalSessions as number,
        rating: data.rating as number,
        isBlocked: data.isBlocked as boolean,
        blockedReason: data.blockedReason as string | null,
        blockedAt: data.blockedAt as Date | null,
        isAdminBlocked: data.isAdminBlocked as boolean,
        updatedAt: new Date()
      }
    });
    return this.toDomain(updated);
  }

  async create(skill: Skill): Promise<Skill> {
    const data = skill.toJSON();
    const created = await this.prisma.skill.create({
      data: {
        id: data.id as string,
        providerId: data.providerId as string,
        templateId: data.templateId as string | null,
        title: data.title as string,
        description: data.description as string,
        category: data.category as string,
        level: data.level as string,
        durationHours: data.durationHours as number,
        creditsPerHour: data.creditsPerHour as number,
        tags: data.tags as string[],
        imageUrl: data.imageUrl as string | null,
        status: data.status as string,
      }
    });
    return this.toDomain(created);
  }

  async findByProviderId(providerId: string): Promise<Skill[]> {
    const skills = await this.prisma.skill.findMany({
      where: {
        providerId,
        isDeleted: false,
        verificationStatus: {
          not: 'failed' // Exclude failed MCQ skills (blocked skills are shown)
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return skills.map((s: any) => this.toDomain(s));
  }

  async findById(id: string): Promise<Skill | null> {
    const skill = await this.prisma.skill.findUnique({
      where: { id }
    });
    return skill ? this.toDomain(skill) : null;
  }

  async findAll(): Promise<Skill[]> {
    const skills = await this.prisma.skill.findMany({
      where: { isDeleted: false }
    });
    return skills.map((s: any) => this.toDomain(s));
  }

  private toDomain(ormEntity: any): Skill {
    return new Skill({
      id: ormEntity.id,
      providerId: ormEntity.providerId,
      templateId: ormEntity.templateId,
      title: ormEntity.title,
      description: ormEntity.description,
      category: ormEntity.category,
      level: ormEntity.level,
      durationHours: ormEntity.durationHours,
      creditsPerHour: ormEntity.creditsPerHour,
      tags: ormEntity.tags,
      imageUrl: ormEntity.imageUrl,
      status: ormEntity.status as any,
      verificationStatus: ormEntity.verificationStatus,
      mcqScore: ormEntity.mcqScore,
      mcqTotalQuestions: ormEntity.mcqTotalQuestions,
      mcqPassingScore: ormEntity.mcqPassingScore,
      totalSessions: ormEntity.totalSessions,
      rating: Number(ormEntity.rating),
      isBlocked: ormEntity.isBlocked || false,
      blockedReason: ormEntity.blockedReason || null,
      blockedAt: ormEntity.blockedAt || null,
      isAdminBlocked: ormEntity.isAdminBlocked || false,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt
    });
  }
}