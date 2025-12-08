import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { IBrowseSkillsUseCase } from './interfaces/IBrowseSkillsUseCase';
import { BrowseSkillsRequestDTO } from '../../dto/skill/BrowseSkillsRequestDTO';
import { BrowseSkillsResponseDTO } from '../../dto/skill/BrowseSkillsResponseDTO';
import { IBrowseSkillMapper } from '../../mappers/interfaces/IBrowseSkillMapper';
export declare class BrowseSkillsUseCase implements IBrowseSkillsUseCase {
    private skillRepository;
    private userRepository;
    private availabilityRepository;
    private browseSkillMapper;
    constructor(skillRepository: ISkillRepository, userRepository: IUserRepository, availabilityRepository: IAvailabilityRepository, browseSkillMapper: IBrowseSkillMapper);
    execute(filters: BrowseSkillsRequestDTO): Promise<BrowseSkillsResponseDTO>;
}
//# sourceMappingURL=BrowseSkillsUseCase.d.ts.map