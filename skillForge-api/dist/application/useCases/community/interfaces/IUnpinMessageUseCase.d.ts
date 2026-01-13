import { CommunityMessage } from '../../../../domain/entities/CommunityMessage';
export interface IUnpinMessageUseCase {
    execute(userId: string, messageId: string): Promise<CommunityMessage>;
}
//# sourceMappingURL=IUnpinMessageUseCase.d.ts.map