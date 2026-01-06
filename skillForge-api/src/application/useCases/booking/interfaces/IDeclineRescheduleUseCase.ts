export interface DeclineRescheduleRequestDTO {
  bookingId: string;
  userId: string;
  reason: string;
}

export interface IDeclineRescheduleUseCase {
  execute(request: DeclineRescheduleRequestDTO): Promise<void>;
}

