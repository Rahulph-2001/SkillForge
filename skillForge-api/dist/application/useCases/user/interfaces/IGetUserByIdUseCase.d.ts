import { User } from '../../../../domain/entities/User';
export interface IGetUserByIdUseCase {
    execute(userId: string): Promise<User>;
}
//# sourceMappingURL=IGetUserByIdUseCase.d.ts.map