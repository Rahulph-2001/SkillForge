import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { IS3Service } from '../../../domain/services/IS3Service';
import { Community } from '../../../domain/entities/Community';
import { CreateCommunityDTO } from '../../dto/community/CreateCommunityDTO';
import { PrismaClient } from '@prisma/client';
export interface ICreateCommunityUseCase {
    execute(userId: string, dto: CreateCommunityDTO, imageFile?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<Community>;
}
export declare class CreateCommunityUseCase implements ICreateCommunityUseCase {
    private readonly communityRepository;
    private readonly s3Service;
    private readonly prisma;
    constructor(communityRepository: ICommunityRepository, s3Service: IS3Service, prisma: PrismaClient);
    execute(userId: string, dto: CreateCommunityDTO, imageFile?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<Community>;
}
//# sourceMappingURL=CreateCommunityUseCase.d.ts.map