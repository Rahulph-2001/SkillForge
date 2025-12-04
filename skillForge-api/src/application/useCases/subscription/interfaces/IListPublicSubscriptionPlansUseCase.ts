import { ListPublicSubscriptionPlansResponseDTO } from '../../../dto/subscription/ListPublicSubscriptionPlansResponseDTO';

export interface IListPublicSubscriptionPlansUseCase {
  execute(): Promise<ListPublicSubscriptionPlansResponseDTO>;
}
