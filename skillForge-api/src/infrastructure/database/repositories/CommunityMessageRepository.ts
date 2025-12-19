import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from '../../di/types';
import { ICommunityMessageRepository } from '../../../domain/repositories/ICommunityMessageRepository';
import { CommunityMessage } from '../../../domain/entities/CommunityMessage';


@injectable()
export class CommunityMessageRepository implements ICommunityMessageRepository {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
  ) { }
  public async create(message: CommunityMessage): Promise<CommunityMessage> {
    const data = message.toJSON();
    const created = await this.prisma.communityMessage.create({
      data: {
        id: data.id as string,
        communityId: data.community_id as string,
        senderId: data.sender_id as string,
        content: data.content as string,
        type: data.type as string,
        fileUrl: data.file_url as string | null,
        fileName: data.file_name as string | null,
        isPinned: data.is_pinned as boolean,
        replyToId: data.reply_to_id as string | null,
        forwardedFromId: data.forwarded_from_id as string | null,
        isDeleted: data.is_deleted as boolean,
        createdAt: data.created_at as Date,
        updatedAt: data.updated_at as Date,
      },
    });
    return CommunityMessage.fromDatabaseRow(created);
  }
  public async findById(id: string): Promise<CommunityMessage | null> {
    const message = await this.prisma.communityMessage.findUnique({
      where: { id },
    });
    return message ? CommunityMessage.fromDatabaseRow(message) : null;
  }
  public async findByCommunityId(communityId: string, limit = 50, offset = 0): Promise<CommunityMessage[]> {
    const messages = await this.prisma.communityMessage.findMany({
      where: { communityId, isDeleted: false },
      include: {
        sender: true,
        reactions: {
          include: { user: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
    return messages.map(m => CommunityMessage.fromDatabaseRow(m));
  }
  public async findPinnedMessages(communityId: string): Promise<CommunityMessage[]> {
    const messages = await this.prisma.communityMessage.findMany({
      where: { communityId, isPinned: true, isDeleted: false },
      orderBy: { pinnedAt: 'desc' },
    });
    return messages.map(m => CommunityMessage.fromDatabaseRow(m));
  }
  public async update(message: CommunityMessage): Promise<CommunityMessage> {
    const data = message.toJSON();
    const updated = await this.prisma.communityMessage.update({
      where: { id: message.id },
      data: {
        isPinned: data.is_pinned as boolean,
        pinnedAt: data.pinned_at as Date | null,
        pinnedBy: data.pinned_by as string | null,
        isDeleted: data.is_deleted as boolean,
        deletedAt: data.deleted_at as Date | null,
        updatedAt: new Date(),
      },
    });
    return CommunityMessage.fromDatabaseRow(updated);
  }
  public async delete(id: string): Promise<void> {
    await this.prisma.communityMessage.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date(), updatedAt: new Date() },
    });
  }
}
