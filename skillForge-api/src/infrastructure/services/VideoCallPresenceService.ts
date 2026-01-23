import { injectable, inject } from 'inversify';
import { TYPES } from '../di/types';
import { RedisService } from './RedisService';
import { IVideoCallPresenceService, Participant, UserSession } from '../../domain/services/IVideoCallPresenceService';

@injectable()
export class VideoCallPresenceService implements IVideoCallPresenceService {
  private readonly TTL = 86400;
  constructor(@inject(TYPES.RedisService) private redis: RedisService) { }

  private roomKey(roomId: string) { return `video:room:${roomId}:participants`; }
  private userKey(userId: string) { return `video:user:${userId}`; }

  async addParticipant(roomId: string, userId: string, socketId: string): Promise<void> {
    const client = this.redis.getClient();
    await client.hset(this.roomKey(roomId), userId, JSON.stringify({ userId, socketId, joinedAt: new Date().toISOString() }));
    await client.expire(this.roomKey(roomId), this.TTL);
    await this.setUserSession(userId, roomId, socketId);
  }

  async removeParticipant(roomId: string, userId: string): Promise<void> {
    await this.redis.getClient().hdel(this.roomKey(roomId), userId);
    await this.clearUserSession(userId);
  }

  async getParticipants(roomId: string): Promise<Participant[]> {
    const data = await this.redis.getClient().hgetall(this.roomKey(roomId));
    return Object.values(data).map(p => { const x = JSON.parse(p); return { userId: x.userId, socketId: x.socketId, joinedAt: new Date(x.joinedAt) }; });
  }

  async getParticipantCount(roomId: string): Promise<number> {
    return await this.redis.getClient().hlen(this.roomKey(roomId));
  }

  async isUserInRoom(roomId: string, userId: string): Promise<boolean> {
    const result = await this.redis.getClient().hexists(this.roomKey(roomId), userId);
    return result === 1;
  }

  async setUserSession(userId: string, roomId: string, socketId: string): Promise<void> {
    const client = this.redis.getClient();
    await client.set(this.userKey(userId), JSON.stringify({ roomId, socketId }));
    await client.expire(this.userKey(userId), this.TTL);
  }

  async getUserSession(userId: string): Promise<UserSession | null> {
    const data = await this.redis.getClient().get(this.userKey(userId));
    return data ? JSON.parse(data) : null;
  }

  async clearUserSession(userId: string): Promise<void> {
    await this.redis.getClient().del(this.userKey(userId));
  }

  async clearRoom(roomId: string): Promise<void> {
    await this.redis.getClient().del(this.roomKey(roomId));
  }
}