import { EventDonation } from 'echadospalante-domain';

export interface EventDonationsRepository {
  findAllByEvent(eventId: string): Promise<EventDonation[]>;
  save(
    eventId: string,
    donorId: string,
    currency: string,
    amount: number,
  ): Promise<EventDonation>;
}

export const EventDonationsRepository = Symbol('EventDonationsRepository');
