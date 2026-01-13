import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { Skill } from '../../../domain/entities/Skill';
import { Database } from '../Database';
import { BaseRepository } from '../BaseRepository';
import { BrowseSkillsRequestDTO } from '../../../application/dto/skill/BrowseSkillsRequestDTO';
export declare class SkillRepository extends BaseRepository<Skill> implements ISkillRepository {
    constructor(db: Database);
    browse(filters: BrowseSkillsRequestDTO): Promise<{
        skills: Skill[];
        total: number;
    }>;
    findPending(): Promise<Skill[]>;
    findById(id: string): Promise<Skill | null>;
    findByProviderId(providerId: string): Promise<Skill[]>;
    findByProviderIdAndStatus(providerId: string, status: string): Promise<Skill[]>;
    findAll(): Promise<Skill[]>;
    create(skill: Skill): Promise<Skill>;
    update(skill: Skill): Promise<Skill>;
    delete(id: string): Promise<void>;
    private toDomain;
}
//# sourceMappingURL=SkillRepository.d.ts.map