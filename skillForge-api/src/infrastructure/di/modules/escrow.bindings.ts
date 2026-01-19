import { ContainerModule, interfaces } from 'inversify';
import { TYPES } from '../types';
import { IEscrowRepository } from '../../../domain/repositories/IEscrowRepository';
import { EscrowRepository } from '../../database/repositories/EscrowRepository';

export const escrowModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IEscrowRepository>(TYPES.IEscrowRepository).to(EscrowRepository).inSingletonScope();
});