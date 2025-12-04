export interface CancelBookingRequestDTO {
  bookingId: string;
  userId: string;
  reason?: string;
}

export interface ICancelBookingUseCase {
  execute(request: CancelBookingRequestDTO): Promise<void>;
}
