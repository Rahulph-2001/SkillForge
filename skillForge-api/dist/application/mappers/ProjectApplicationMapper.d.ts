import { ProjectApplication } from '../../domain/entities/ProjectApplication';
import { ProjectApplicationResponseDTO } from '../dto/projectApplication/ProjectApplicationResponseDTO';
import { IProjectApplicationMapper, ApplicantInfo } from './interfaces/IProjectApplicationMapper';
export declare class ProjectApplicationMapper implements IProjectApplicationMapper {
    toResponseDTO(application: ProjectApplication, applicant?: ApplicantInfo): ProjectApplicationResponseDTO;
    toResponseDTOList(applications: ProjectApplication[], applicantsMap?: Map<string, ApplicantInfo>): ProjectApplicationResponseDTO[];
}
//# sourceMappingURL=ProjectApplicationMapper.d.ts.map