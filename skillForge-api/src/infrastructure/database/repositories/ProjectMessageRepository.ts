
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { PrismaClient } from '@prisma/client';
import { IProjectMessageRepository } from '../../../domain/repositories/IProjectMessageRepository';
import { ProjectMessage } from '../../../domain/entities/ProjectMessage';

@injectable()
export class ProjectMessageRepository implements IProjectMessageRepository {
    constructor(
        @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient
    ) { }

    async create(message: ProjectMessage): Promise<ProjectMessage> {
        const created = await this.prisma.projectMessage.create({
            data: {
                id: message.id,
                projectId: message.projectId,
                senderId: message.senderId,
                content: message.content,
                isRead: message.isRead,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                }
            }
        });

        return this.toDomain(created);
    }

    async findByProjectId(projectId: string): Promise<ProjectMessage[]> {
        const messages = await this.prisma.projectMessage.findMany({
            where: {
                projectId: projectId
            },
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                }
            }
        });

        return messages.map(this.toDomain);
    }

    async findById(id: string): Promise<ProjectMessage | null> {
        const message = await this.prisma.projectMessage.findUnique({
            where: { id },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                }
            }
        });

        return message ? this.toDomain(message) : null;
    }

    async markAsRead(id: string): Promise<void> {
        await this.prisma.projectMessage.update({
            where: { id },
            data: { isRead: true }
        });
    }

    async markAllAsRead(projectId: string, userId: string): Promise<void> {
        // Mark all messages in this project NOT sent by me (userId) as read
        await this.prisma.projectMessage.updateMany({
            where: {
                projectId: projectId,
                senderId: { not: userId }, // Messages sent by OTHER person
                isRead: false
            },
            data: { isRead: true }
        });
    }

    private toDomain(ormEntity: any): ProjectMessage {
        return new ProjectMessage({
            id: ormEntity.id,
            projectId: ormEntity.projectId,
            senderId: ormEntity.senderId,
            content: ormEntity.content,
            isRead: ormEntity.isRead,
            createdAt: ormEntity.createdAt,
            updatedAt: ormEntity.updatedAt,
            sender: ormEntity.sender ? {
                id: ormEntity.sender.id,
                name: ormEntity.sender.name,
                avatarUrl: ormEntity.sender.avatarUrl,
            } : undefined
        });
    }
}
