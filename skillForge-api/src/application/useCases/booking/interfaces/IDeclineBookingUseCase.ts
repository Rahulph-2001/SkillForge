export interface DeclineBookingRequestDTO {
  bookingId: string;
  providerId: string;
  reason?: string;
}

export interface IDeclineBookingUseCase {
  execute(request: DeclineBookingRequestDTO): Promise<void>;
}

