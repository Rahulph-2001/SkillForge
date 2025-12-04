import { BrowseSkillsRequestDTO } from '../../../dto/skill/BrowseSkillsRequestDTO';
import { BrowseSkillsResponseDTO } from '../../../dto/skill/BrowseSkillsResponseDTO';

export interface IBrowseSkillsUseCase {
  execute(request: BrowseSkillsRequestDTO): Promise<BrowseSkillsResponseDTO>;
}
