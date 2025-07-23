import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginatedBody, VentureSponsorship } from 'echadospalante-domain';
import {
  UserData,
  VentureData,
  VentureSponsorshipData,
} from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';
import { DataSource, Repository } from 'typeorm';

import { VentureSponsorshipsRepository } from '../../domain/gateway/database/venture-sponsorships.repository';

@Injectable()
export class VentureSponsorshipsRepositoryImpl
  implements VentureSponsorshipsRepository
{
  private readonly logger: Logger = new Logger(
    VentureSponsorshipsRepositoryImpl.name,
  );
  public constructor(
    @InjectRepository(VentureSponsorshipData)
    private ventureSponsorshipRepository: Repository<VentureSponsorshipData>,
    private dataSource: DataSource,
  ) {}

  public findById(sponsorshipId: string): Promise<VentureSponsorship | null> {
    return this.ventureSponsorshipRepository
      .createQueryBuilder('ventureSponsorship')
      .leftJoinAndSelect('ventureSponsorship.sponsor', 'sponsor')
      .where('ventureSponsorship.id = :sponsorshipId', { sponsorshipId })
      .getOne()
      .then((sponsorship) => {
        if (!sponsorship) {
          return null;
        }
        return JSON.parse(JSON.stringify(sponsorship)) as VentureSponsorship;
      });
  }

  public async findManyByVenture(
    ventureId: string,
    skip: number,
    take: number,
  ): Promise<PaginatedBody<VentureSponsorship>> {
    const [sponsorships, total] = await this.ventureSponsorshipRepository
      .createQueryBuilder('ventureSponsorship')
      .leftJoinAndSelect('ventureSponsorship.venture', 'venture')
      .leftJoinAndSelect('ventureSponsorship.sponsor', 'sponsor')
      .where('venture.id = :ventureId', { ventureId })
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      items: sponsorships.map(
        (sponsorship) =>
          JSON.parse(JSON.stringify(sponsorship)) as VentureSponsorship,
      ),
      total,
    };
  }

  public async save(
    ventureId: string,
    sponsorId: string,
    monthlyAmount: number,
  ): Promise<VentureSponsorship> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newSponsorship = queryRunner.manager.create(
        VentureSponsorshipData,
        {
          venture: { id: ventureId } as VentureData,
          sponsor: { id: sponsorId } as UserData,
          monthlyAmount,
          currency: 'COP',
        },
      );

      const savedSponsorship = await queryRunner.manager.save(newSponsorship);

      // Increment sponsorshipsCount by 1
      await queryRunner.manager.increment(
        VentureData,
        { id: ventureId },
        'sponsorshipsCount',
        1,
      );

      // Increment totalSponsorships by the sponsorship amount
      await queryRunner.manager.increment(
        VentureData,
        { id: ventureId },
        'totalSponsorships',
        monthlyAmount,
      );

      await queryRunner.commitTransaction();

      return JSON.parse(JSON.stringify(savedSponsorship)) as VentureSponsorship;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error saving donnation with transaction', error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public cancel(ventureId: string, sponsorshipId: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    return queryRunner
      .connect()
      .then(() => queryRunner.startTransaction())
      .then(() =>
        queryRunner.manager
          .findOne(VentureSponsorshipData, { where: { id: sponsorshipId } })
          .then((sponsorship) => {
            if (!sponsorship) {
              throw new Error(`Sponsorship with id ${sponsorshipId} not found`);
            }
            return queryRunner.manager.remove(sponsorship);
          }),
      )
      .then(() =>
        queryRunner.manager.decrement(
          VentureData,
          { id: ventureId },
          'sponsorshipsCount',
          1,
        ),
      )
      .then(() => queryRunner.commitTransaction())
      .then(() => true)
      .catch((error) => {
        this.logger.error(
          'Error deleting sponsorship with transaction',
          error.stack,
        );
        return queryRunner.rollbackTransaction().then(() => false);
      })
      .finally(() => queryRunner.release());
  }

  public findManySent(
    userEmail: string,
    skip: number,
    take: number,
  ): Promise<PaginatedBody<VentureSponsorship>> {
    return this.ventureSponsorshipRepository
      .createQueryBuilder('ventureSponsorship')
      .leftJoinAndSelect('ventureSponsorship.venture', 'venture')
      .leftJoinAndSelect('ventureSponsorship.sponsor', 'sponsor')
      .where('sponsor.email = :sponsorEmail', { sponsorEmail: userEmail })
      .skip(skip)
      .take(take)
      .getManyAndCount()
      .then(([sponsorships, total]) => ({
        items: sponsorships.map(
          (sponsorship) =>
            JSON.parse(JSON.stringify(sponsorship)) as VentureSponsorship,
        ),
        total,
      }));
  }

  public findManyReceived(
    userEmail: string,
    skip: number,
    take: number,
  ): Promise<PaginatedBody<VentureSponsorship>> {
    return this.ventureSponsorshipRepository
      .createQueryBuilder('ventureSponsorship')
      .leftJoinAndSelect('ventureSponsorship.venture', 'venture')
      .leftJoinAndSelect('venture.location', 'location')
      .leftJoinAndSelect('ventureSponsorship.sponsor', 'sponsor')
      .leftJoinAndSelect('venture.owner', 'user')
      .where('user.email = :userEmail', { userEmail })
      .skip(skip)
      .take(take)
      .getManyAndCount()
      .then(([sponsorships, total]) => ({
        items: sponsorships.map(
          (sponsorship) =>
            JSON.parse(JSON.stringify(sponsorship)) as VentureSponsorship,
        ),
        total,
      }));
  }
}
