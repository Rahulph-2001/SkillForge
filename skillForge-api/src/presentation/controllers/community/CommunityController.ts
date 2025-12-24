import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICreateCommunityUseCase } from '../../../application/useCases/community/CreateCommunityUseCase';
import { IUpdateCommunityUseCase } from '../../../application/useCases/community/UpdateCommunityUseCase';
import { IGetCommunitiesUseCase } from '../../../application/useCases/community/GetCommunitiesUseCase';
import { IGetCommunityDetailsUseCase } from '../../../application/useCases/community/GetCommunityDetailsUseCase';
import { IJoinCommunityUseCase } from '../../../application/useCases/community/JoinCommunityUseCase';
import { ILeaveCommunityUseCase } from '../../../application/useCases/community/LeaveCommunityUseCase';
import { ISendMessageUseCase } from '../../../application/useCases/community/SendMessageUseCase';
import { IGetCommunityMessagesUseCase } from '../../../application/useCases/community/GetCommunityMessagesUseCase';
import { IPinMessageUseCase } from '../../../application/useCases/community/PinMessageUseCase';
import { IUnpinMessageUseCase } from '../../../application/useCases/community/UnpinMessageUseCase';
import { IDeleteMessageUseCase } from '../../../application/useCases/community/DeleteMessageUseCase';
import { IRemoveCommunityMemberUseCase } from '../../../application/useCases/community/RemoveCommunityMemberUseCase';
import { IAddReactionUseCase } from '../../../application/useCases/community/AddReactionUseCase';
import { IRemoveReactionUseCase } from '../../../application/useCases/community/RemoveReactionUseCase';
import { ICommunityMapper } from '../../../application/mappers/interfaces/ICommunityMapper';
import { ICommunityMessageMapper } from '../../../application/mappers/interfaces/ICommunityMessageMapper';
import { IResponseBuilder } from '../../../shared/http/IResponseBuilder';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { CreateCommunityDTO } from '../../../application/dto/community/CreateCommunityDTO';
import { UpdateCommunityDTO } from '../../../application/dto/community/UpdateCommunityDTO';
import { SendMessageDTO } from '../../../application/dto/community/SendMessageDTO';
import { HttpStatusCode } from '../../../domain/enums/HttpStatusCode';
import { SUCCESS_MESSAGES } from '../../../config/messages';
import { CommunityMember } from '../../../domain/entities/CommunityMember';
@injectable()
export class CommunityController {
  constructor(
    @inject(TYPES.CreateCommunityUseCase) private readonly createCommunityUseCase: ICreateCommunityUseCase,
    @inject(TYPES.UpdateCommunityUseCase) private readonly updateCommunityUseCase: IUpdateCommunityUseCase,
    @inject(TYPES.GetCommunitiesUseCase) private readonly getCommunitiesUseCase: IGetCommunitiesUseCase,
    @inject(TYPES.GetCommunityDetailsUseCase) private readonly getCommunityDetailsUseCase: IGetCommunityDetailsUseCase,
    @inject(TYPES.JoinCommunityUseCase) private readonly joinCommunityUseCase: IJoinCommunityUseCase,
    @inject(TYPES.LeaveCommunityUseCase) private readonly leaveCommunityUseCase: ILeaveCommunityUseCase,
    @inject(TYPES.SendMessageUseCase) private readonly sendMessageUseCase: ISendMessageUseCase,
    @inject(TYPES.GetCommunityMessagesUseCase) private readonly getCommunityMessagesUseCase: IGetCommunityMessagesUseCase,
    @inject(TYPES.PinMessageUseCase) private readonly pinMessageUseCase: IPinMessageUseCase,
    @inject(TYPES.UnpinMessageUseCase) private readonly unpinMessageUseCase: IUnpinMessageUseCase,
    @inject(TYPES.DeleteMessageUseCase) private readonly deleteMessageUseCase: IDeleteMessageUseCase,
    @inject(TYPES.RemoveCommunityMemberUseCase) private readonly removeCommunityMemberUseCase: IRemoveCommunityMemberUseCase,
    @inject(TYPES.AddReactionUseCase) private readonly addReactionUseCase: IAddReactionUseCase,
    @inject(TYPES.RemoveReactionUseCase) private readonly removeReactionUseCase: IRemoveReactionUseCase,
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository,
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

      const members = await this.communityRepository.findMembersByCommunityId(communityId);

      // Paginate manually
      const paginatedMembers = members.slice(offset, offset + limit);

      const response = this.responseBuilder.success(
        {
          members: paginatedMembers.map((m: CommunityMember) => m.toJSON()),
          total: members.length,
          limit,
          offset,
        },
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