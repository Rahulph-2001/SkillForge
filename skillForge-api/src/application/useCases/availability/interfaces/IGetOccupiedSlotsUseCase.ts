export interface IGetOccupiedSlotsUseCase {
  execute(providerId: string, startDate: string, endDate: string): Promise<{ start: string; end: string }[]>;
}

