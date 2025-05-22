// import { VenturePublicationEvent } from 'echadospalante-domain';

export interface PublicationAMQPProducer {
  emitVenturePublicationCreatedEvent(
    event: any /*VenturePublicationEvent*/,
  ): Promise<boolean>;
  emitVenturePublicationUpdatedEvent(
    event: any /*VenturePublicationEvent*/,
  ): Promise<boolean>;
  emitVenturePublicationEnabledEvent(
    event: any /*VenturePublicationEvent*/,
  ): Promise<boolean>;
  emitVenturePublicationDisabledEvent(
    event: any /*VenturePublicationEvent*/,
  ): Promise<boolean>;
  emitVenturePublicationLoggedEvent(
    event: any /*VenturePublicationEvent*/,
  ): Promise<boolean>;
  emitVenturePublicationDeletedEvent(
    event: any /*VenturePublicationEvent*/,
  ): Promise<boolean>;
  emitVenturePublicationRegisteredEvent(
    event: any /*VenturePublicationEvent*/,
  ): Promise<boolean>;
  emitVenturePublicationVerifiedEvent(
    event: any /*VenturePublicationEvent*/,
  ): Promise<boolean>;
  emitVenturePublicationUnverifiedEvent(
    event: any /*VenturePublicationEvent*/,
  ): Promise<boolean>;
}

export const PublicationAMQPProducer = Symbol('PublicationAMQPProducer');
