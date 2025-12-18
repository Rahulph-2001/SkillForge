import { IPasswordService } from '../../domain/services/IPasswordService';
export declare class PasswordService implements IPasswordService {
    hash(password: string): Promise<string>;
    compare(password: string, hashedPassword: string): Promise<boolean>;
}
//# sourceMappingURL=PasswordService.d.ts.map