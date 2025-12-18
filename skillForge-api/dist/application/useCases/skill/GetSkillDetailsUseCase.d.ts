import { ISkillRepository } from '../../../domain/repositories/ISkillRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IAvailabilityRepository } from '../../../domain/repositories/IAvailabilityRepository';
import { IGetSkillDetailsUseCase } from './interfaces/IGetSkillDetailsUseCase';
import { SkillDetailsDTO } from '../../dto/skill/SkillDetailsResponseDTO';
import { ISkillDetailsMapper } from '../../mappers/interfaces/ISkillDetailsMapper';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
export declare class GetSkillDetailsUseCase implements IGetSkillDetailsUseCase {
    private skillRepository;
    private userRepository;
    private availabilityRepository;
    private bookingRepository;
    private skillDetailsMapper;
    constructor(skillRepository: ISkillRepository, userRepository: IUserRepository, availabilityRepository: IAvailabilityRepository, bookingRepository: IBookingRepository, skillDetailsMapper: ISkillDetailsMapper);
    execute(skillId: string): Promise<SkillDetailsDTO>;
    private calculateEndTime;
}
//# sourceMappingURL=GetSkillDetailsUseCase.d.ts.map