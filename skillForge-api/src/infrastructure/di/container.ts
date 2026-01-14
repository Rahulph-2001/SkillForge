import 'reflect-metadata';
import { Container } from 'inversify';
import { container } from './di';
import { TYPES } from './types';
import { App } from '../../presentation/server';

// Import all binding modules
import { bindRepositoryModule } from './modules/repository.bindings';
import { bindServiceModule } from './modules/service.bindings';
import { bindMapperModule } from './modules/mapper.bindings';
import { bindAuthModule } from './modules/auth.bindings';
import { bindUserModule } from './modules/user.bindings';
import { bindBookingModule } from './modules/booking.bindings';
import { bindSkillModule } from './modules/skill.bindings';
import { bindSubscriptionModule } from './modules/subscription.bindings';
import { bindPaymentModule } from './modules/payment.bindings';
import { bindCommunityModule } from './modules/community.bindings';
import { bindAdminModule } from './modules/admin.bindings';
import { bindProjectModule } from './modules/project.bindings';
import { bindAdminSessionModule } from './modules/adminSession.bindings';

export { container };

/**
 * Main Dependency Injection Container Setup
 * 
 * This file orchestrates all DI bindings by importing and calling
 * feature-specific binding modules. This modular approach makes the
 * DI container more maintainable and follows Clean Architecture principles.
 */

// Bind all modules in dependency order
// 1. Core infrastructure (repositories, services, mappers)
bindRepositoryModule(container);
bindServiceModule(container);
bindMapperModule(container);

// 2. Feature modules
bindAuthModule(container);
bindUserModule(container);
bindBookingModule(container);
bindSkillModule(container);
bindSubscriptionModule(container);
bindPaymentModule(container);
bindCommunityModule(container);
bindAdminModule(container);
bindProjectModule(container);
bindAdminSessionModule(container);

// 3. Application entry point
container.bind<App>(TYPES.App).to(App);
