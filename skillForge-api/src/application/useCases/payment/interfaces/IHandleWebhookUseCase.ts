import { WebhookEventDTO } from '../../../dto/payment/WebhookEventDTO';

export interface IHandleWebhookUseCase {
    execute(event: WebhookEventDTO): Promise<void>;
}

