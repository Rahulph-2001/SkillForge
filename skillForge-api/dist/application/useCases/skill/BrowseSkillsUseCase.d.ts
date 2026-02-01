import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { IPaginationService } from '../../../domain/services/IPaginationService';
import { IBrowseSkillsUseCase } from './interfaces/IBrowseSkillsUseCase';
import { BrowseSkillsRequestDTO } from '../../dto/skill/BrowseSkillsRequestDTO';
import { BrowseSkillsResponseDTO } from '../../dto/skill/BrowseSkillsResponseDTO';
import { IBrowseSkillMapper } from '../../mappers/interfaces/IBrowseSkillMapper';
export declare class BrowseSkillsUseCase implements IBrowseSkillsUseCase {
    private skillRepository;
    private userRepository;
    private availabilityRepository;
    private browseSkillMapper;
    private paginationService;
    constructor(skillRepository: ISkillRepository, userRepository: IUserRepository, availabilityRepository: IAvailabilityRepository, browseSkillMapper: IBrowseSkillMapper, paginationService: IPaginationService);
    execute(filters: BrowseSkillsRequestDTO): Promise<BrowseSkillsResponseDTO>;
}
//# sourceMappingURL=BrowseSkillsUseCase.d.ts.map