import { type GetAdminWalletStatsResponseDTO } from "../../../dto/admin/GetAdminWalletStatsDTO";

export interface IGetAdminWalletStatsUseCase {
    execute(): Promise<GetAdminWalletStatsResponseDTO>
}