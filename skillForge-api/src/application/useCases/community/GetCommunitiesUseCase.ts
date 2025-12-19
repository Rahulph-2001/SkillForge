import { injectable, inject } from 'inversify';
import { TYPES } from '../../../infrastructure/di/types';
import { ICommunityRepository } from '../../../domain/repositories/ICommunityRepository';
import { Community } from '../../../domain/entities/Community';


export interface IGetCommunitiesUseCase {
  execute(filters?: { category?: string }, userId?: string): Promise<Community[]>;
}
@injectable()
export class GetCommunitiesUseCase implements IGetCommunitiesUseCase {
  constructor(
    @inject(TYPES.ICommunityRepository) private readonly communityRepository: ICommunityRepository
  ) { }
  public async execute(filters?: { category?: string }, userId?: string): Promise<Community[]> {
    const communities = await this.communityRepository.findAll({ ...filters, isActive: true });

    if (userId) {
      const memberships = await this.communityRepository.findMembershipsByUserId(userId);
      const joinedCommunityIds = new Set(memberships.map(m => m.communityId));

      return communities.map(community => {
        const isJoined = joinedCommunityIds.has(community.id);
        const isAdmin = community.adminId === userId;

        // Return a new instance or modified object with the flags
        // Since Community entity might have these as private/getters, we might need a method or setter. 
        // Checking Community entity... it has setters or public props? 
        // Let's assume we can set them or pass them in a way. 
        // The Community entity has getters/setters for these but they are not persisted to DB directly in the same way.
        // Actually, the Community entity in `domain/entities/Community.ts` does NOT have `isJoined` or `isAdmin` as standard properties mapped to DB.
        // But the DTO `CommunityResponseDTO` DOES have them.
        // The `Community` entity needs to hold these transient values if we want to pass them to the Controller -> Mapper.
        // Let's check Community entity again. I recall seeing `isJoined` in DTO but maybe not in Entity?
        // Wait, I saw Community.ts before. Let's act as if I can assign them or check if I need to update Entity first.
        // Better: I will update the Entity file in the NEXT step if needed. 
        // For this step I will write code that attempts to set them.

        // Correction: The `Community` class is an entity. modifying it to hold view-related flags is okay for DDD if they are domain concepts (membership).
        // I'll update the usecase to set them.

        community.isJoined = isJoined;
        community.isAdmin = isAdmin;
        return community;
      });
    }

    return communities;
  }
}