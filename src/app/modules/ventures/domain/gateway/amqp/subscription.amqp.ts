// import { SubscriptionSubscription } from 'echadospalante-domain';

export interface SubscriptionAMQPProducer {
  emitSubscriptionCreatedEvent(
    subscription: any /*SubscriptionSubscription*/,
  ): Promise<boolean>;
  emitSubscriptionUpdatedEvent(
    subscription: any /*SubscriptionSubscription*/,
  ): Promise<boolean>;
  emitSubscriptionEnabledEvent(
    subscription: any /*SubscriptionSubscription*/,
  ): Promise<boolean>;
  emitSubscriptionDisabledEvent(
    subscription: any /*SubscriptionSubscription*/,
  ): Promise<boolean>;
  emitSubscriptionLoggedEvent(
    subscription: any /*SubscriptionSubscription*/,
  ): Promise<boolean>;
  emitSubscriptionDeletedEvent(
    subscription: any /*SubscriptionSubscription*/,
  ): Promise<boolean>;
  emitSubscriptionRegisteredEvent(
    subscription: any /*SubscriptionSubscription*/,
  ): Promise<boolean>;
  emitSubscriptionVerifiedEvent(
    subscription: any /*SubscriptionSubscription*/,
  ): Promise<boolean>;
  emitSubscriptionUnverifiedEvent(
    subscription: any /*SubscriptionSubscription*/,
  ): Promise<boolean>;
}

export const SubscriptionAMQPProducer = Symbol('SubscriptionAMQPProducer');
