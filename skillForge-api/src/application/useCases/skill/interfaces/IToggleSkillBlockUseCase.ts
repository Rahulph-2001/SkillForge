import { Skill } from '../../../../domain/entities/Skill';

export interface IToggleSkillBlockUseCase {
    execute(skillId: string, providerId: string): Promise<Skill>;
}

