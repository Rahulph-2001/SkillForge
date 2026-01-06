export interface AcceptRescheduleRequestDTO {
  bookingId: string;
  userId: string;
}

export interface IAcceptRescheduleUseCase {
  execute(request: AcceptRescheduleRequestDTO): Promise<void>;
}

