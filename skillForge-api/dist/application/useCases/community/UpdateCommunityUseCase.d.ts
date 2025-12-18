import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IS3Service } from '../../../domain/services/IS3Service';
import { Community } from '../../../domain/entities/Community';
import { UpdateCommunityDTO } from '../../dto/community/UpdateCommunityDTO';
export interface IUpdateCommunityUseCase {
    execute(communityId: string, userId: string, dto: UpdateCommunityDTO, imageFile?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<Community>;
}
export declare class UpdateCommunityUseCase implements IUpdateCommunityUseCase {
    private readonly communityRepository;
    private readonly s3Service;
    constructor(communityRepository: ICommunityRepository, s3Service: IS3Service);
    execute(communityId: string, userId: string, dto: UpdateCommunityDTO, imageFile?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<Community>;
}
//# sourceMappingURL=UpdateCommunityUseCase.d.ts.map