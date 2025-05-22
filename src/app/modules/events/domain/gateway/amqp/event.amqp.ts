// import { VentureEventEvent } from 'echadospalante-domain';

export interface EventAMQPProducer {
  emitVentureEventCreatedEvent(
    event: any /*VentureEventEvent*/,
  ): Promise<boolean>;
  emitVentureEventUpdatedEvent(
    event: any /*VentureEventEvent*/,
  ): Promise<boolean>;
  emitVentureEventEnabledEvent(
    event: any /*VentureEventEvent*/,
  ): Promise<boolean>;
  emitVentureEventDisabledEvent(
    event: any /*VentureEventEvent*/,
  ): Promise<boolean>;
  emitVentureEventLoggedEvent(
    event: any /*VentureEventEvent*/,
  ): Promise<boolean>;
  emitVentureEventDeletedEvent(
    event: any /*VentureEventEvent*/,
  ): Promise<boolean>;
  emitVentureEventRegisteredEvent(
    event: any /*VentureEventEvent*/,
  ): Promise<boolean>;
  emitVentureEventVerifiedEvent(
    event: any /*VentureEventEvent*/,
  ): Promise<boolean>;
  emitVentureEventUnverifiedEvent(
    event: any /*VentureEventEvent*/,
  ): Promise<boolean>;
}

export const EventAMQPProducer = Symbol('EventAMQPProducer');
