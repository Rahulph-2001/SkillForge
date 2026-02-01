import { ProjectApplication } from '../../../domain/entities/ProjectApplication';
import { ProjectApplicationResponseDTO } from '../../dto/projectApplication/ProjectApplicationResponseDTO';
export interface ApplicantInfo {
    id: string;
    name: string;
    avatarUrl: string | null;
    rating: number;
    reviewCount: number;
    skillsOffered: string[];
}
export interface IProjectApplicationMapper {
    toResponseDTO(application: ProjectApplication, applicant?: ApplicantInfo): ProjectApplicationResponseDTO;
    toResponseDTOList(applications: ProjectApplication[], applicantsMap?: Map<string, ApplicantInfo>): ProjectApplicationResponseDTO[];
}
//# sourceMappingURL=IProjectApplicationMapper.d.ts.map