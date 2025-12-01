import { injectable, inject } from 'inversify';
import { ISkillTemplateRepository } from '../../../domain/repositories/ISkillTemplateRepository';
import { SkillTemplate } from '../../../domain/entities/SkillTemplate';
import { Database } from '../Database';
import { TYPES } from '../../di/types';

@injectable()
export class SkillTemplateRepository implements ISkillTemplateRepository {
  private readonly prisma;

  constructor(@inject(TYPES.Database) db: Database) {
    this.prisma = db.getClient();
  }

  async create(template: SkillTemplate): Promise<SkillTemplate> {
    const data = template.toJSON();
    
    // Don't pass id - let database generate UUID
    const created = await this.prisma.skillTemplate.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        creditsMin: data.creditsMin,
        creditsMax: data.creditsMax,
        mcqCount: data.mcqCount,
        passRange: data.passRange,
        levels: data.levels,
        tags: data.tags,
        status: data.status,
        isActive: data.isActive,
      },
    });
    
    return this.toDomain(created);
  }

  async findById(id: string): Promise<SkillTemplate | null> {
    const template = await this.prisma.skillTemplate.findUnique({
      where: { id },
    });
    return template ? this.toDomain(template) : null;
  }

  async findAll(): Promise<SkillTemplate[]> {
    const templates = await this.prisma.skillTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return templates.map((t: any) => this.toDomain(t));
  }

  async findByCategory(category: string): Promise<SkillTemplate[]> {
    const templates = await this.prisma.skillTemplate.findMany({
      where: { category, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return templates.map((t: any) => this.toDomain(t));
  }

  async findByStatus(status: string): Promise<SkillTemplate[]> {
    const templates = await this.prisma.skillTemplate.findMany({
      where: { status, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return templates.map((t: any) => this.toDomain(t));
  }

  async update(id: string, updates: Partial<SkillTemplate>): Promise<SkillTemplate> {
    const updateData: any = {};
    
    if (updates.title) updateData.title = updates.title;
    if (updates.category) updateData.category = updates.category;
    if (updates.description) updateData.description = updates.description;
    if (updates.creditsMin !== undefined) updateData.creditsMin = updates.creditsMin;
    if (updates.creditsMax !== undefined) updateData.creditsMax = updates.creditsMax;
    if (updates.mcqCount !== undefined) updateData.mcqCount = updates.mcqCount;
    if (updates.passRange !== undefined) updateData.passRange = updates.passRange;
    if (updates.levels) updateData.levels = updates.levels;
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.status) updateData.status = updates.status;
    
    updateData.updatedAt = new Date();

    const updated = await this.prisma.skillTemplate.update({
      where: { id },
      data: updateData,
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.skillTemplate.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async toggleStatus(id: string): Promise<SkillTemplate> {
    const template = await this.prisma.skillTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    const newStatus = template.status === 'Active' ? 'Inactive' : 'Active';
    
    const updated = await this.prisma.skillTemplate.update({
      where: { id },
      data: { status: newStatus, updatedAt: new Date() },
    });

    return this.toDomain(updated);
  }

  private toDomain(ormEntity: any): SkillTemplate {
    return new SkillTemplate({
      id: ormEntity.id,
      title: ormEntity.title,
      category: ormEntity.category,
      description: ormEntity.description,
      creditsMin: ormEntity.creditsMin,
      creditsMax: ormEntity.creditsMax,
      mcqCount: ormEntity.mcqCount,
      passRange: ormEntity.passRange,
      levels: ormEntity.levels,
      tags: ormEntity.tags,
      status: ormEntity.status,
      isActive: ormEntity.isActive,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }
}
