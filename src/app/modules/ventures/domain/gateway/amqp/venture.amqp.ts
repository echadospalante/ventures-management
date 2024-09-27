import { Venture } from 'echadospalante-core';

export interface VentureAMQPProducer {
  emitVentureCreatedEvent(venture: Venture): Promise<boolean>;
  emitVentureUpdatedEvent(venture: Venture): Promise<boolean>;
  emitVentureEnabledEvent(venture: Venture): Promise<boolean>;
  emitVentureDisabledEvent(venture: Venture): Promise<boolean>;
  emitVentureLoggedEvent(venture: Venture): Promise<boolean>;
  emitVentureDeletedEvent(venture: Venture): Promise<boolean>;
  emitVentureRegisteredEvent(venture: Venture): Promise<boolean>;
  emitVentureVerifiedEvent(venture: Venture): Promise<boolean>;
  emitVentureUnverifiedEvent(venture: Venture): Promise<boolean>;
}

export const VentureAMQPProducer = Symbol('VentureAMQPProducer');
