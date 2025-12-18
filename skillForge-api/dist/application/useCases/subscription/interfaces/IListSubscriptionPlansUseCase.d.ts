import { ListSubscriptionPlansRequestDTO } from '../../../dto/subscription/ListSubscriptionPlansRequestDTO';
import { ListSubscriptionPlansResponseDTO } from '../../../dto/subscription/ListSubscriptionPlansResponseDTO';
export interface IListSubscriptionPlansUseCase {
    execute(request: ListSubscriptionPlansRequestDTO): Promise<ListSubscriptionPlansResponseDTO>;
}
//# sourceMappingURL=IListSubscriptionPlansUseCase.d.ts.map