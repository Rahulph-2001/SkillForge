import { Database } from '../../../infrastructure/database/Database';
import { IStorageService } from '../../../domain/services/IStorageService';
export interface UpdateUserProfileDTO {
    userId: string;
    name?: string;
    bio?: string;
    location?: string;
    avatarFile?: Express.Multer.File;
}
export interface UpdatedProfileResponse {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    bio: string | null;
    location: string | null;
}
export declare class UpdateUserProfileUseCase {
    private prisma;
    private storageService;
    constructor(database: Database, storageService: IStorageService);
    execute(dto: UpdateUserProfileDTO): Promise<UpdatedProfileResponse>;
}
//# sourceMappingURL=UpdateUserProfileUseCase.d.ts.map