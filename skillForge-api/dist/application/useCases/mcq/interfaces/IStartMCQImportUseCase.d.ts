import { StartMCQImportRequestDTO, StartMCQImportResponseDTO } from '../../../dto/mcq/StartMCQImportDTO';
export interface IStartMCQImportUseCase {
    execute(request: StartMCQImportRequestDTO, file: Express.Multer.File): Promise<StartMCQImportResponseDTO>;
}
//# sourceMappingURL=IStartMCQImportUseCase.d.ts.map