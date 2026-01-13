import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IGetUserByIdUseCase } from './interfaces/IGetUserByIdUseCase';
import { User } from '../../../domain/entities/User';
export declare class GetUserByIdUseCase implements IGetUserByIdUseCase {
    private readonly userRepository;
    constructor(userRepository: IUserRepository);
    execute(userId: string): Promise<User>;
}
//# sourceMappingURL=GetUserByIdUseCase.d.ts.map