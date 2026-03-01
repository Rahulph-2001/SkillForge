import { type ListPendingSkillsResponseDTO } from '../../../dto/admin/ListPendingSkillsResponseDTO';

export interface IListPendingSkillsUseCase {
  execute(): Promise<ListPendingSkillsResponseDTO>;
}
