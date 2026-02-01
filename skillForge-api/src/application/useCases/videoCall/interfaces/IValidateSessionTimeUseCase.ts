import { ValidateSessionTimeResponseDTO } from '../../../dto/videoCall/ValidateSessionTimeDTO';

export interface IValidateSessionTimeUseCase {
  execute(userId: string, bookingId: string): Promise<ValidateSessionTimeResponseDTO>;
}