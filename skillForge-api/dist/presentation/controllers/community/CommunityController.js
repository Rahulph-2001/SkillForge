"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../infrastructure/di/types");
const HttpStatusCode_1 = require("../../../domain/enums/HttpStatusCode");
const messages_1 = require("../../../config/messages");
let CommunityController = class CommunityController {
    constructor(createCommunityUseCase, updateCommunityUseCase, getCommunitiesUseCase, getCommunityDetailsUseCase, joinCommunityUseCase, leaveCommunityUseCase, sendMessageUseCase, getCommunityMessagesUseCase, pinMessageUseCase, unpinMessageUseCase, deleteMessageUseCase, removeCommunityMemberUseCase, communityRepository, communityMapper, communityMessageMapper, responseBuilder) {
        this.createCommunityUseCase = createCommunityUseCase;
        this.updateCommunityUseCase = updateCommunityUseCase;
        this.getCommunitiesUseCase = getCommunitiesUseCase;
        this.getCommunityDetailsUseCase = getCommunityDetailsUseCase;
        this.joinCommunityUseCase = joinCommunityUseCase;
        this.leaveCommunityUseCase = leaveCommunityUseCase;
        this.sendMessageUseCase = sendMessageUseCase;
        this.getCommunityMessagesUseCase = getCommunityMessagesUseCase;
        this.pinMessageUseCase = pinMessageUseCase;
        this.unpinMessageUseCase = unpinMessageUseCase;
        this.deleteMessageUseCase = deleteMessageUseCase;
        this.removeCommunityMemberUseCase = removeCommunityMemberUseCase;
        this.communityRepository = communityRepository;
        this.communityMapper = communityMapper;
        this.communityMessageMapper = communityMessageMapper;
        this.responseBuilder = responseBuilder;
        this.createCommunity = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const dto = req.body;
                const file = req.file;
                const community = await this.createCommunityUseCase.execute(userId, dto, file ? {
                    buffer: file.buffer,
                    originalname: file.originalname,
                    mimetype: file.mimetype
                } : undefined);
                const response = this.responseBuilder.success(this.communityMapper.toDTO(community, userId), messages_1.SUCCESS_MESSAGES.COMMUNITY.CREATED, HttpStatusCode_1.HttpStatusCode.CREATED);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.updateCommunity = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { id } = req.params;
                const dto = req.body;
                const file = req.file;
                const community = await this.updateCommunityUseCase.execute(id, userId, dto, file ? {
                    buffer: file.buffer,
                    originalname: file.originalname,
                    mimetype: file.mimetype
                } : undefined);
                const response = this.responseBuilder.success(this.communityMapper.toDTO(community, userId), messages_1.SUCCESS_MESSAGES.COMMUNITY.UPDATED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getCommunities = async (req, res, next) => {
            try {
                const userId = req.user?.userId;
                const { category } = req.query;
                const communities = await this.getCommunitiesUseCase.execute({
                    category: category
                });
                const response = this.responseBuilder.success(this.communityMapper.toDTOList(communities, userId), 'Communities retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getCommunityDetails = async (req, res, next) => {
            try {
                const userId = req.user?.userId;
                const { id } = req.params;
                const community = await this.getCommunityDetailsUseCase.execute(id);
                const response = this.responseBuilder.success(this.communityMapper.toDTO(community, userId), 'Community details retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.joinCommunity = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { id } = req.params;
                await this.joinCommunityUseCase.execute(userId, id);
                const response = this.responseBuilder.success({ communityId: id }, messages_1.SUCCESS_MESSAGES.COMMUNITY.JOINED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.leaveCommunity = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { id } = req.params;
                await this.leaveCommunityUseCase.execute(userId, id);
                const response = this.responseBuilder.success({ communityId: id }, messages_1.SUCCESS_MESSAGES.COMMUNITY.LEFT, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.sendMessage = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const dto = req.body;
                const file = req.file;
                const message = await this.sendMessageUseCase.execute(userId, dto, file ? {
                    buffer: file.buffer,
                    originalname: file.originalname,
                    mimetype: file.mimetype
                } : undefined);
                const messageDTO = await this.communityMessageMapper.toDTO(message);
                const response = this.responseBuilder.success(messageDTO, messages_1.SUCCESS_MESSAGES.COMMUNITY.MESSAGE_SENT, HttpStatusCode_1.HttpStatusCode.CREATED);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getMessages = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { id } = req.params;
                const limit = parseInt(req.query.limit) || 50;
                const offset = parseInt(req.query.offset) || 0;
                const messages = await this.getCommunityMessagesUseCase.execute(userId, id, limit, offset);
                const messageDTOs = await this.communityMessageMapper.toDTOList(messages);
                const response = this.responseBuilder.success(messageDTOs, 'Messages retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.pinMessage = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { messageId } = req.params;
                const message = await this.pinMessageUseCase.execute(userId, messageId);
                const messageDTO = await this.communityMessageMapper.toDTO(message);
                const response = this.responseBuilder.success(messageDTO, messages_1.SUCCESS_MESSAGES.COMMUNITY.MESSAGE_PINNED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.unpinMessage = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { messageId } = req.params;
                const message = await this.unpinMessageUseCase.execute(userId, messageId);
                const messageDTO = await this.communityMessageMapper.toDTO(message);
                const response = this.responseBuilder.success(messageDTO, messages_1.SUCCESS_MESSAGES.COMMUNITY.MESSAGE_UNPINNED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteMessage = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { messageId } = req.params;
                await this.deleteMessageUseCase.execute(userId, messageId);
                const response = this.responseBuilder.success({ messageId }, messages_1.SUCCESS_MESSAGES.COMMUNITY.MESSAGE_DELETED, HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.removeMember = async (req, res, next) => {
            try {
                const userId = req.user.userId;
                const { id: communityId, memberId } = req.params;
                await this.removeCommunityMemberUseCase.execute(userId, communityId, memberId);
                const response = this.responseBuilder.success({ communityId, memberId }, 'Member removed successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
        this.getMembers = async (req, res, next) => {
            try {
                const { id: communityId } = req.params;
                const limit = parseInt(req.query.limit) || 50;
                const offset = parseInt(req.query.offset) || 0;
                const members = await this.communityRepository.findMembersByCommunityId(communityId);
                // Paginate manually
                const paginatedMembers = members.slice(offset, offset + limit);
                const response = this.responseBuilder.success({
                    members: paginatedMembers.map((m) => m.toJSON()),
                    total: members.length,
                    limit,
                    offset,
                }, 'Members retrieved successfully', HttpStatusCode_1.HttpStatusCode.OK);
                res.status(response.statusCode).json(response.body);
            }
            catch (error) {
                next(error);
            }
        };
    }
};
exports.CommunityController = CommunityController;
exports.CommunityController = CommunityController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CreateCommunityUseCase)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UpdateCommunityUseCase)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.GetCommunitiesUseCase)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.GetCommunityDetailsUseCase)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.JoinCommunityUseCase)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.LeaveCommunityUseCase)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.SendMessageUseCase)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.GetCommunityMessagesUseCase)),
    __param(8, (0, inversify_1.inject)(types_1.TYPES.PinMessageUseCase)),
    __param(9, (0, inversify_1.inject)(types_1.TYPES.UnpinMessageUseCase)),
    __param(10, (0, inversify_1.inject)(types_1.TYPES.DeleteMessageUseCase)),
    __param(11, (0, inversify_1.inject)(types_1.TYPES.RemoveCommunityMemberUseCase)),
    __param(12, (0, inversify_1.inject)(types_1.TYPES.ICommunityRepository)),
    __param(13, (0, inversify_1.inject)(types_1.TYPES.ICommunityMapper)),
    __param(14, (0, inversify_1.inject)(types_1.TYPES.ICommunityMessageMapper)),
    __param(15, (0, inversify_1.inject)(types_1.TYPES.IResponseBuilder)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object])
], CommunityController);
//# sourceMappingURL=CommunityController.js.map