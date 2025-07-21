import { EventDonation, PaginatedBody } from 'echadospalante-domain';

export interface EventDonationsRepository {
  findManySent(
    userEmail: string,
    skip: number,
    take: number,
  ): Promise<PaginatedBody<EventDonation>>;
  findManyReceived(
    userEmail: string,
    skip: number,
    take: number,
  ): Promise<PaginatedBody<EventDonation>>;
  findManyByEvent(
    eventId: string,
    skip: number,
    take: number,
  ): Promise<PaginatedBody<EventDonation>>;
  save(
    eventId: string,
    donorId: string,
    amount: number,
  ): Promise<EventDonation>;
}

export const EventDonationsRepository = Symbol('EventDonationsRepository');
