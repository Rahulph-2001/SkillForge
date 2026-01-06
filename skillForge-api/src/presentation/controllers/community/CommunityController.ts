import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreateCommunityUseCase } from '../../../application/useCases/community/interfaces/ICreateCommunityUseCase';
import { IUpdateCommunityUseCase } from '../../../application/useCases/community/interfaces/IUpdateCommunityUseCase';
import { IGetCommunitiesUseCase } from '../../../application/useCases/community/interfaces/IGetCommunitiesUseCase';
import { IGetCommunityDetailsUseCase } from '../../../application/useCases/community/interfaces/IGetCommunityDetailsUseCase';
import { IJoinCommunityUseCase } from '../../../application/useCases/community/interfaces/IJoinCommunityUseCase';
import { ILeaveCommunityUseCase } from '../../../application/useCases/community/interfaces/ILeaveCommunityUseCase';
import { ISendMessageUseCase } from '../../../application/useCases/community/interfaces/ISendMessageUseCase';
import { IGetCommunityMessagesUseCase } from '../../../application/useCases/community/interfaces/IGetCommunityMessagesUseCase';
import { IPinMessageUseCase } from '../../../application/useCases/community/interfaces/IPinMessageUseCase';
import { IUnpinMessageUseCase } from '../../../application/useCases/community/interfaces/IUnpinMessageUseCase';
import { IDeleteMessageUseCase } from '../../../application/useCases/community/interfaces/IDeleteMessageUseCase';
import { IRemoveCommunityMemberUseCase } from '../../../application/useCases/community/interfaces/IRemoveCommunityMemberUseCase';
import { IAddReactionUseCase } from '../../../application/useCases/community/interfaces/IAddReactionUseCase';
import { IRemoveReactionUseCase } from '../../../application/useCases/community/interfaces/IRemoveReactionUseCase';
import { IGetCommunityMembersUseCase } from '../../../application/useCases/community/interfaces/IGetCommunityMembersUseCase';
import { ICommunityMapper } from '../../../application/mappers/interfaces/ICommunityMapper';
import { ICommunityMessageMapper } from '../../../application/mappers/interfaces/ICommunityMessageMapper';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { CreateCommunityDTO } from '../../../application/dto/community/CreateCommunityDTO';
import { UpdateCommunityDTO } from '../../../application/dto/community/UpdateCommunityDTO';
import { SendMessageDTO } from '../../../application/dto/community/SendMessageDTO';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { SUCCESS_MESSAGES } from '../../../config/messages';
@injectable()
export class CommunityController {
  constructor(
    @inject(TYPES.ICreateCommunityUseCase) private readonly createCommunityUseCase: ICreateCommunityUseCase,
    @inject(TYPES.IUpdateCommunityUseCase) private readonly updateCommunityUseCase: IUpdateCommunityUseCase,
    @inject(TYPES.IGetCommunitiesUseCase) private readonly getCommunitiesUseCase: IGetCommunitiesUseCase,
    @inject(TYPES.IGetCommunityDetailsUseCase) private readonly getCommunityDetailsUseCase: IGetCommunityDetailsUseCase,
    @inject(TYPES.IJoinCommunityUseCase) private readonly joinCommunityUseCase: IJoinCommunityUseCase,
    @inject(TYPES.ILeaveCommunityUseCase) private readonly leaveCommunityUseCase: ILeaveCommunityUseCase,
    @inject(TYPES.ISendMessageUseCase) private readonly sendMessageUseCase: ISendMessageUseCase,
    @inject(TYPES.IGetCommunityMessagesUseCase) private readonly getCommunityMessagesUseCase: IGetCommunityMessagesUseCase,
    @inject(TYPES.IPinMessageUseCase) private readonly pinMessageUseCase: IPinMessageUseCase,
    @inject(TYPES.IUnpinMessageUseCase) private readonly unpinMessageUseCase: IUnpinMessageUseCase,
    @inject(TYPES.IDeleteMessageUseCase) private readonly deleteMessageUseCase: IDeleteMessageUseCase,
    @inject(TYPES.IRemoveCommunityMemberUseCase) private readonly removeCommunityMemberUseCase: IRemoveCommunityMemberUseCase,
    @inject(TYPES.IAddReactionUseCase) private readonly addReactionUseCase: IAddReactionUseCase,
    @inject(TYPES.IRemoveReactionUseCase) private readonly removeReactionUseCase: IRemoveReactionUseCase,
    @inject(TYPES.IGetCommunityMembersUseCase) private readonly getCommunityMembersUseCase: IGetCommunityMembersUseCase,
    @inject(TYPES.ICommunityMapper) private readonly communityMapper: ICommunityMapper,
    @inject(TYPES.ICommunityMessageMapper) private readonly communityMessageMapper: ICommunityMessageMapper,
    @inject(TYPES.IResponseBuilder) private readonly responseBuilder: IResponseBuilder
  ) { }
  public createCommunity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('🎯 CommunityController.createCommunity - START');
      const userId = (req as any).user.userId;
      console.log('👤 User ID from auth:', userId);

      // Parse FormData fields - FormData sends everything as strings
      const dto: CreateCommunityDTO = {
        ...req.body,
        creditsCost: req.body.creditsCost ? parseInt(req.body.creditsCost, 10) : undefined
      };
      console.log('📝 DTO received:', dto);

      const file = req.file;
      console.log('📎 File received:', file ? { name: file.originalname, size: file.size, type: file.mimetype } : 'No file');

      console.log('🚀 Calling createCommunityUseCase.execute...');
      const community = await this.createCommunityUseCase.execute(
        userId,
        dto,
        file ? {
          buffer: file.buffer,
          originalname: file.originalname,
          mimetype: file.mimetype
        } : undefined
      );

      console.log('✅ Use case completed, community created:', community.id);
      console.log('🗺️  Mapping to DTO...');
      const communityDTO = this.communityMapper.toDTO(community, userId);

      console.log('📤 Building response...');
      const response = this.responseBuilder.success(
        communityDTO,
        SUCCESS_MESSAGES.COMMUNITY.CREATED,
        HttpStatusCode.CREATED
      );

      console.log('✅ Sending response with status:', response.statusCode);
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      console.error('❌ ERROR in createCommunity controller:', error);
      next(error);
    }
  };
  public updateCommunity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;

      // Parse FormData fields - FormData sends everything as strings
      const dto: UpdateCommunityDTO = {
        ...req.body,
        creditsCost: req.body.creditsCost ? parseInt(req.body.creditsCost, 10) : undefined
      };
      const file = req.file;
      const community = await this.updateCommunityUseCase.execute(
        id,
        userId,
        dto,
        file ? {
          buffer: file.buffer,
          originalname: file.originalname,
          mimetype: file.mimetype
        } : undefined
      );
      const response = this.responseBuilder.success(
        this.communityMapper.toDTO(community, userId),
        SUCCESS_MESSAGES.COMMUNITY.UPDATED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
  public getCommunities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;
      const { category } = req.query;
      const communities = await this.getCommunitiesUseCase.execute({
        category: category as string
      }, userId);
      const response = this.responseBuilder.success(
        this.communityMapper.toDTOList(communities, userId),
        SUCCESS_MESSAGES.COMMUNITY.FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
  public getCommunityDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.userId;
      const { id } = req.params;
      const community = await this.getCommunityDetailsUseCase.execute(id, userId);
      const response = this.responseBuilder.success(
        this.communityMapper.toDTO(community, userId),
        SUCCESS_MESSAGES.COMMUNITY.DETAILS_FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
  public joinCommunity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;
      await this.joinCommunityUseCase.execute(userId, id);
      const response = this.responseBuilder.success(
        { communityId: id },
        SUCCESS_MESSAGES.COMMUNITY.JOINED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
  public leaveCommunity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;
      await this.leaveCommunityUseCase.execute(userId, id);
      const response = this.responseBuilder.success(
        { communityId: id },
        SUCCESS_MESSAGES.COMMUNITY.LEFT,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
  public sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const dto: SendMessageDTO = req.body;
      const file = req.file;
      const message = await this.sendMessageUseCase.execute(
        userId,
        dto,
        file ? {
          buffer: file.buffer,
          originalname: file.originalname,
          mimetype: file.mimetype
        } : undefined
      );
      const messageDTO = await this.communityMessageMapper.toDTO(message);
      const response = this.responseBuilder.success(
        messageDTO,
        SUCCESS_MESSAGES.COMMUNITY.MESSAGE_SENT,
        HttpStatusCode.CREATED
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
  public getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const messages = await this.getCommunityMessagesUseCase.execute(userId, id, limit, offset);
      const messageDTOs = await this.communityMessageMapper.toDTOList(messages);
      const response = this.responseBuilder.success(
        messageDTOs,
        SUCCESS_MESSAGES.COMMUNITY.MESSAGES_FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
  public pinMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { messageId } = req.params;
      const message = await this.pinMessageUseCase.execute(userId, messageId);
      const messageDTO = await this.communityMessageMapper.toDTO(message);
      const response = this.responseBuilder.success(
        messageDTO,
        SUCCESS_MESSAGES.COMMUNITY.MESSAGE_PINNED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
  public unpinMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { messageId } = req.params;
      const message = await this.unpinMessageUseCase.execute(userId, messageId);
      const messageDTO = await this.communityMessageMapper.toDTO(message);
      const response = this.responseBuilder.success(
        messageDTO,
        SUCCESS_MESSAGES.COMMUNITY.MESSAGE_UNPINNED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
  public deleteMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { messageId } = req.params;
      await this.deleteMessageUseCase.execute(userId, messageId);
      const response = this.responseBuilder.success(
        { messageId },
        SUCCESS_MESSAGES.COMMUNITY.MESSAGE_DELETED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  public removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { id: communityId, memberId } = req.params;
      await this.removeCommunityMemberUseCase.execute(userId, communityId, memberId);
      const response = this.responseBuilder.success(
        { communityId, memberId },
        SUCCESS_MESSAGES.COMMUNITY.MEMBER_REMOVED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  public getMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id: communityId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await this.getCommunityMembersUseCase.execute(communityId, limit, offset);

      const response = this.responseBuilder.success(
        result,
        SUCCESS_MESSAGES.COMMUNITY.MEMBERS_FETCHED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  public addReaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { messageId } = req.params;
      const { emoji } = req.body;

      const reaction = await this.addReactionUseCase.execute(userId, messageId, emoji);

      const response = this.responseBuilder.success(
        reaction.toJSON(),
        SUCCESS_MESSAGES.COMMUNITY.REACTION_ADDED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };

  public removeReaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.userId;
      const { messageId, emoji } = req.params;

      await this.removeReactionUseCase.execute(userId, messageId, emoji);

      const response = this.responseBuilder.success(
        { messageId, emoji },
        SUCCESS_MESSAGES.COMMUNITY.REACTION_REMOVED,
        HttpStatusCode.OK
      );
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  };
}