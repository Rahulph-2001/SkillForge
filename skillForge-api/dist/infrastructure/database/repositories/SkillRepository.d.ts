import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { Database } from '../Database';
import { BrowseSkillsRequestDTO } from '../../../application/dto/skill/BrowseSkillsRequestDTO';
export declare class SkillRepository implements ISkillRepository {
    private readonly prisma;
    constructor(db: Database);
    browse(filters: BrowseSkillsRequestDTO): Promise<{
        skills: Skill[];
        total: number;
    }>;
    findPending(): Promise<Skill[]>;
    update(skill: Skill): Promise<Skill>;
    create(skill: Skill): Promise<Skill>;
    findByProviderId(providerId: string): Promise<Skill[]>;
    findById(id: string): Promise<Skill | null>;
    findAll(): Promise<Skill[]>;
    private toDomain;
}
//# sourceMappingURL=SkillRepository.d.ts.map