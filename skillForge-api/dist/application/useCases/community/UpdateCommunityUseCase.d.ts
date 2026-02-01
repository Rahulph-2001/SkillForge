import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IStorageService } from '../../../domain/services/IStorageService';
import { Community } from '../../../domain/entities/Community';
import { UpdateCommunityDTO } from '../../dto/community/UpdateCommunityDTO';
import { IUpdateCommunityUseCase } from './interfaces/IUpdateCommunityUseCase';
export declare class UpdateCommunityUseCase implements IUpdateCommunityUseCase {
    private readonly communityRepository;
    private readonly storageService;
    private readonly userRepository;
    constructor(communityRepository: ICommunityRepository, storageService: IStorageService, userRepository: IUserRepository);
    execute(communityId: string, userId: string, dto: UpdateCommunityDTO, imageFile?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<Community>;
}
//# sourceMappingURL=UpdateCommunityUseCase.d.ts.map