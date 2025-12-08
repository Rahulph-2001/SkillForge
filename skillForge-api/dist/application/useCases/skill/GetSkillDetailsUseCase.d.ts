import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { IGetSkillDetailsUseCase } from './interfaces/IGetSkillDetailsUseCase';
import { SkillDetailsDTO } from '../../dto/skill/SkillDetailsResponseDTO';
import { ISkillDetailsMapper } from '../../mappers/interfaces/ISkillDetailsMapper';
export declare class GetSkillDetailsUseCase implements IGetSkillDetailsUseCase {
    private skillRepository;
    private userRepository;
    private availabilityRepository;
    private skillDetailsMapper;
    constructor(skillRepository: ISkillRepository, userRepository: IUserRepository, availabilityRepository: IAvailabilityRepository, skillDetailsMapper: ISkillDetailsMapper);
    execute(skillId: string): Promise<SkillDetailsDTO>;
}
//# sourceMappingURL=GetSkillDetailsUseCase.d.ts.map