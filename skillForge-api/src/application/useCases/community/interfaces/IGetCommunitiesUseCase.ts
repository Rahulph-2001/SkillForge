import { type Community } from '../../../../domain/entities/Community';

import { type IPaginationResult } from '../../../../domain/types/IPaginationParams';

export interface IGetCommunitiesUseCase {
  execute(filters?: { category?: string; search?: string }, userId?: string, page?: number, limit?: number): Promise<IPaginationResult<Community>>;
}

