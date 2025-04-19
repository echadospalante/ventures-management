import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventDonationsRepository } from '../gateway/database/event-donations.repository';

@Injectable()
export class EventDonationsService {
  private readonly logger: Logger = new Logger(EventDonationsService.name);

  public constructor(
    @Inject(EventDonationsRepository)
    private eventDonationsRepository: EventDonationsRepository,
  ) {}

  public createDonation(
    eventId: string,
    requestedBy: string,
    amount: number,
    currency: string,
  ) {
    return this.eventDonationsRepository.save(
      eventId,
      requestedBy,
      currency,
      amount,
    );
  }

  public getEventDonations(eventId: string) {
    return this.eventDonationsRepository.findAllByEvent(eventId);
  }
}
