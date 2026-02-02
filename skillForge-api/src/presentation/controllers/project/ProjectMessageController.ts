
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ISendProjectMessageUseCase } from '../../../application/useCases/project/interfaces/ISendProjectMessageUseCase';
import { IGetProjectMessagesUseCase } from '../../../application/useCases/project/interfaces/IGetProjectMessagesUseCase';
import { CreateProjectMessageSchema } from '../../../application/dto/project/ProjectMessageDTO';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../config/messages';
import { ZodError } from 'zod';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        userId: string;
        email: string;
        role: string;
    };
}

@injectable()
export class ProjectMessageController {
    constructor(
        @inject(TYPES.ISendProjectMessageUseCase) private readonly sendUseCase: ISendProjectMessageUseCase,
        @inject(TYPES.IGetProjectMessagesUseCase) private readonly getMessagesUseCase: IGetProjectMessagesUseCase,
        @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
    ) { }

    public getMessages = async (req: Request, res: Response): Promise<void> => {
        try {
            const projectId = req.params.projectId;
            if (!projectId) {
                const response = this.responseBuilder.error('VALIDATION_ERROR', 'Project ID is required', 400);
                res.status(response.statusCode).json(response.body);
                return;
            }

            const currentUserId = (req as AuthenticatedRequest).user.id;
            const messages = await this.getMessagesUseCase.execute(currentUserId, projectId);

            const response = this.responseBuilder.success(messages, SUCCESS_MESSAGES.COMMUNITY.MESSAGES_FETCHED);
            res.status(response.statusCode).json(response.body);
        } catch (error: any) {
            console.error('Get Messages Error:', error);
            if (error.type === 'NOT_FOUND') {
                const response = this.responseBuilder.error('NOT_FOUND', error.message, 404);
                res.status(response.statusCode).json(response.body);
                return;
            }
            if (error.type === 'FORBIDDEN') {
                const response = this.responseBuilder.error('FORBIDDEN', error.message, 403);
                res.status(response.statusCode).json(response.body);
                return;
            }
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', ERROR_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR, 500);
            res.status(response.statusCode).json(response.body);
        }
    };

    public sendMessage = async (req: Request, res: Response): Promise<void> => {
        try {
            const projectId = req.params.projectId;
            if (!projectId) {
                const response = this.responseBuilder.error('VALIDATION_ERROR', 'Project ID is required', 400);
                res.status(response.statusCode).json(response.body);
                return;
            }

            const validation = CreateProjectMessageSchema.safeParse({ ...req.body, projectId });
            if (!validation.success) {
                const response = this.responseBuilder.error('VALIDATION_ERROR', validation.error.issues[0].message, 400);
                res.status(response.statusCode).json(response.body);
                return;
            }

            const currentUserId = (req as AuthenticatedRequest).user.id;
            const result = await this.sendUseCase.execute(currentUserId, validation.data);

            const response = this.responseBuilder.created(result, SUCCESS_MESSAGES.COMMUNITY.MESSAGE_SENT);
            res.status(response.statusCode).json(response.body);
        } catch (error: any) {
            console.error('Send Message Error:', error);
            if (error.type === 'NOT_FOUND') {
                const response = this.responseBuilder.error('NOT_FOUND', error.message, 404);
                res.status(response.statusCode).json(response.body);
                return;
            }
            if (error.type === 'FORBIDDEN') {
                const response = this.responseBuilder.error('FORBIDDEN', error.message, 403);
                res.status(response.statusCode).json(response.body);
                return;
            }
            const response = this.responseBuilder.error('INTERNAL_SERVER_ERROR', ERROR_MESSAGES.GENERAL.INTERNAL_SERVER_ERROR, 500);
            res.status(response.statusCode).json(response.body);
        }
    };
}
