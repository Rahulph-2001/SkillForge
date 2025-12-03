import { injectable, inject } from 'inversify';
import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { Database } from '../Database';
import { TYPES } from '../../di/types';

@injectable()
export class SkillRepository implements ISkillRepository {
  private readonly prisma;

  constructor(@inject(TYPES.Database) db: Database) {
    this.prisma = db.getClient();
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
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt
    });
  }
}