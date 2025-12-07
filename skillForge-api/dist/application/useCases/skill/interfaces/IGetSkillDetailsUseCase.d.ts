import { SkillDetailsDTO } from '../../../dto/skill/SkillDetailsResponseDTO';
export interface IGetSkillDetailsUseCase {
    execute(skillId: string): Promise<SkillDetailsDTO>;
}
//# sourceMappingURL=IGetSkillDetailsUseCase.d.ts.map