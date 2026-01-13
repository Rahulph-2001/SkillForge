export interface RescheduleBookingRequestDTO {
    bookingId: string;
    userId: string;
    newDate: string;
    newTime: string;
    reason: string;
}
export interface IRescheduleBookingUseCase {
    execute(request: RescheduleBookingRequestDTO): Promise<void>;
}
//# sourceMappingURL=IRescheduleBookingUseCase.d.ts.map