import { Request, Response } from 'express';
import { ISendProjectMessageUseCase } from '../../../application/useCases/project/interfaces/ISendProjectMessageUseCase';
import { IGetProjectMessagesUseCase } from '../../../application/useCases/project/interfaces/IGetProjectMessagesUseCase';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
export declare class ProjectMessageController {
    private readonly sendUseCase;
    private readonly getMessagesUseCase;
    private readonly responseBuilder;
    constructor(sendUseCase: ISendProjectMessageUseCase, getMessagesUseCase: IGetProjectMessagesUseCase, responseBuilder: IResponseBuilder);
    getMessages: (req: Request, res: Response) => Promise<void>;
    sendMessage: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=ProjectMessageController.d.ts.map