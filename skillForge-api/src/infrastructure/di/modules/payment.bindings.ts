import { Container } from 'inversify';
import { TYPES } from '../types';
import { CreatePaymentIntentUseCase } from '../../../application/useCases/payment/CreatePaymentIntentUseCase';
import { ICreatePaymentIntentUseCase } from '../../../application/useCases/payment/interfaces/ICreatePaymentIntentUseCase';
import { ConfirmPaymentUseCase } from '../../../application/useCases/payment/ConfirmPaymentUseCase';
import { IConfirmPaymentUseCase } from '../../../application/useCases/payment/interfaces/IConfirmPaymentUseCase';
import { HandleWebhookUseCase } from '../../../application/useCases/payment/HandleWebhookUseCase';
import { IHandleWebhookUseCase } from '../../../application/useCases/payment/interfaces/IHandleWebhookUseCase';
import { PaymentController } from '../../../presentation/controllers/payment/PaymentController';
import { PaymentRoutes } from '../../../presentation/routes/payment/paymentRoutes';

/**
 * Binds all payment-related use cases, controllers, and routes
 */
export const bindPaymentModule = (container: Container): void => {
  // Payment Use Cases
  container.bind<ICreatePaymentIntentUseCase>(TYPES.ICreatePaymentIntentUseCase).to(CreatePaymentIntentUseCase);
  container.bind<IConfirmPaymentUseCase>(TYPES.IConfirmPaymentUseCase).to(ConfirmPaymentUseCase);
  container.bind<IHandleWebhookUseCase>(TYPES.IHandleWebhookUseCase).to(HandleWebhookUseCase);
  
  // Controllers & Routes
  container.bind<PaymentController>(TYPES.PaymentController).to(PaymentController);
  container.bind<PaymentRoutes>(TYPES.PaymentRoutes).to(PaymentRoutes);
};

