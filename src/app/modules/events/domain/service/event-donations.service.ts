import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { EventDonationsRepository } from '../gateway/database/event-donations.repository';
import { UserHttpService } from '../gateway/http/http.gateway';

@Injectable()
export class EventDonationsService {
  private readonly logger: Logger = new Logger(EventDonationsService.name);

  public constructor(
    @Inject(EventDonationsRepository)
    private eventDonationsRepository: EventDonationsRepository,
    @Inject(UserHttpService)
    private readonly userHttpService: UserHttpService,
  ) {}

  public async createDonation(
    eventId: string,
    authorEmail: string,
    amount: number,
  ) {
    // return this.eventDonationsRepository.save(
    //   eventId,
    //   requestedBy,
    //   currency,
    //   amount,
    // );

    try {
      const donor = await this.userHttpService.getUserByEmail(authorEmail);

      return this.eventDonationsRepository.save(eventId, donor.id, amount);
    } catch (error) {
      this.logger.error(
        `Error saving donation for event ${eventId}: ${error.message}`,
        error.stack,
      );
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }
  }

  public getEventDonations(eventId: string, skip: number, take: number) {
    return this.eventDonationsRepository.findManyByEvent(eventId, skip, take);
  }

  public getSentEventDonations(
    requesterEmail: string,
    skip: number,
    take: number,
  ) {
    return this.eventDonationsRepository.findManySent(
      requesterEmail,
      skip,
      take,
    );
  }

  public getReceivedEventDonations(
    requesterEmail: string,
    skip: number,
    take: number,
  ) {
    return this.eventDonationsRepository.findManyReceived(
      requesterEmail,
      skip,
      take,
    );
  }
}
