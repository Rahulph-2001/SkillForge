import { type BrowseSkillsRequestDTO } from '../../../dto/skill/BrowseSkillsRequestDTO';
import { type BrowseSkillsResponseDTO } from '../../../dto/skill/BrowseSkillsResponseDTO';

export interface IBrowseSkillsUseCase {
  execute(request: BrowseSkillsRequestDTO): Promise<BrowseSkillsResponseDTO>;
}
