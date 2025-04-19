import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EventDonation } from 'echadospalante-core';
import {
  EventDonationData,
  UserData,
} from 'echadospalante-core/dist/app/modules/infrastructure/database/entities';
import { Repository } from 'typeorm';

import { EventDonationsRepository } from '../../domain/gateway/database/event-donations.repository';

@Injectable()
export class EventDonationsRepositoryImpl implements EventDonationsRepository {
  private readonly logger: Logger = new Logger(
    EventDonationsRepositoryImpl.name,
  );
  public constructor(
    @InjectRepository(EventDonationData)
    private eventDonationRepository: Repository<EventDonationData>,
  ) {}

  public findAllByEvent(eventId: string): Promise<EventDonation[]> {
    return this.eventDonationRepository
      .createQueryBuilder('eventDonation')
      .leftJoinAndSelect('eventDonation.event', 'event')
      .where('event.id = :eventId', { eventId })
      .getMany()
      .then(
        (donations) => JSON.parse(JSON.stringify(donations)) as EventDonation[],
      );
  }

  public save(
    eventId: string,
    donorId: string,
    currency: string,
    amount: number,
  ): Promise<EventDonation> {
    return this.eventDonationRepository
      .save({
        event: { id: eventId } as EventDonationData,
        donor: { id: donorId } as UserData,
        currency,
        amount,
      })
      .then((result) => JSON.parse(JSON.stringify(result)) as EventDonation);
  }
}
