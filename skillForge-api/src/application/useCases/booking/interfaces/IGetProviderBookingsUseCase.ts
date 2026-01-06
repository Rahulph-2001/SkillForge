export interface GetProviderBookingsRequestDTO {
  providerId: string;
  status?: string;
}

export interface GetProviderBookingsResponseDTO {
  success: boolean;
  message: string;
  bookings?: any[];
  stats?: {
    pending: number;
    confirmed: number;
    reschedule: number;
    completed: number;
    cancelled: number;
  };
}

export interface IGetProviderBookingsUseCase {
  execute(request: GetProviderBookingsRequestDTO): Promise<GetProviderBookingsResponseDTO>;
}

