import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EventDonation, PaginatedBody } from 'echadospalante-domain';
import {
  EventDonationData,
  UserData,
  VentureEventData,
} from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';
import { DataSource, Repository } from 'typeorm';

import { EventDonationsRepository } from '../../domain/gateway/database/event-donations.repository';

@Injectable()
export class EventDonationsRepositoryImpl implements EventDonationsRepository {
  private readonly logger: Logger = new Logger(
    EventDonationsRepositoryImpl.name,
  );
  public constructor(
    @InjectRepository(EventDonationData)
    private eventDonationRepository: Repository<EventDonationData>,
    private dataSource: DataSource,
  ) {}

  public async findManyByEvent(
    eventId: string,
    skip: number,
    take: number,
  ): Promise<PaginatedBody<EventDonation>> {
    const [donations, total] = await this.eventDonationRepository
      .createQueryBuilder('eventDonation')
      .leftJoinAndSelect('eventDonation.donor', 'donor')
      .leftJoinAndSelect('event.venture', 'venture')
      .where('event.id = :eventId', { eventId })
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      items: donations.map(
        (donation) => JSON.parse(JSON.stringify(donation)) as EventDonation,
      ),
      total,
    };
  }

  public async save(
    eventId: string,
    donorId: string,
    amount: number,
  ): Promise<EventDonation> {
    console.log({
      eventId,
      donorId,
      amount,
    });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newDonation = queryRunner.manager.create(EventDonationData, {
        event: { id: eventId } as VentureEventData,
        donor: { id: donorId } as UserData,
        amount,
        currency: 'COP',
      });

      const savedDonation = await queryRunner.manager.save(newDonation);

      // Increment donationsCount by 1
      await queryRunner.manager.increment(
        VentureEventData,
        { id: eventId },
        'donationsCount',
        1,
      );

      // Increment totalDonations by the donation amount
      await queryRunner.manager.increment(
        VentureEventData,
        { id: eventId },
        'totalDonations',
        amount,
      );

      await queryRunner.commitTransaction();

      return JSON.parse(JSON.stringify(savedDonation)) as EventDonation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error saving donnation with transaction', error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public findManySent(
    userEmail: string,
    skip: number,
    take: number,
  ): Promise<PaginatedBody<EventDonation>> {
    return this.eventDonationRepository
      .createQueryBuilder('eventDonation')
      .leftJoinAndSelect('eventDonation.event', 'event')
      .leftJoinAndSelect('eventDonation.donor', 'donor')
      .leftJoinAndSelect('event.venture', 'venture')
      .where('donor.email = :donorEmail', { donorEmail: userEmail })
      .skip(skip)
      .take(take)
      .getManyAndCount()
      .then(([donations, total]) => ({
        items: donations.map(
          (donation) => JSON.parse(JSON.stringify(donation)) as EventDonation,
        ),
        total,
      }));
  }

  public findManyReceived(
    userEmail: string,
    skip: number,
    take: number,
  ): Promise<PaginatedBody<EventDonation>> {
    return this.eventDonationRepository
      .createQueryBuilder('eventDonation')
      .leftJoinAndSelect('eventDonation.event', 'event')
      .leftJoinAndSelect('event.location', 'location')
      .leftJoinAndSelect('event.venture', 'venture')
      .leftJoinAndSelect('eventDonation.donor', 'donor')
      .leftJoinAndSelect('venture.owner', 'user')
      .where('user.email = :userEmail', { userEmail })
      .skip(skip)
      .take(take)
      .getManyAndCount()
      .then(([donations, total]) => ({
        items: donations.map(
          (donation) => JSON.parse(JSON.stringify(donation)) as EventDonation,
        ),
        total,
      }));
  }
}
