import { type ListSubscriptionPlansRequestDTO } from '../../../dto/subscription/ListSubscriptionPlansRequestDTO';
import { type ListSubscriptionPlansResponseDTO } from '../../../dto/subscription/ListSubscriptionPlansResponseDTO';

export interface IListSubscriptionPlansUseCase {
  execute(request: ListSubscriptionPlansRequestDTO): Promise<ListSubscriptionPlansResponseDTO>;
}
