import { ListMCQImportJobsResponseDTO } from '../../../dto/mcq/MCQImportJobDTO';

export interface IListMCQImportJobsUseCase {
  execute(templateId: string, adminId: string): Promise<ListMCQImportJobsResponseDTO>;
}