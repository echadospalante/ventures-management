import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  PublicationClapData,
  UserData,
  VenturePublicationData,
} from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';
import { DataSource, Repository } from 'typeorm';

import { PublicationClapsRepository } from '../../domain/gateway/database/publication-claps.repository';
import { PublicationClap } from 'echadospalante-domain';

@Injectable()
export class PublicationClapsRepositoryImpl
  implements PublicationClapsRepository
{
  private readonly logger: Logger = new Logger(
    PublicationClapsRepositoryImpl.name,
  );
  public constructor(
    @InjectRepository(PublicationClapData)
    private publicationClapsRepository: Repository<PublicationClapData>,
    private dataSource: DataSource,
  ) {}

  public findById(clapId: string): Promise<PublicationClap | null> {
    return this.publicationClapsRepository
      .findOne({
        where: { id: clapId },
      })
      .then((clap) => {
        if (!clap) {
          return null;
        }
        return JSON.parse(JSON.stringify(clap)) as PublicationClap;
      });
  }

  public deleteClap(publicationId: string, clapId: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    return queryRunner
      .connect()
      .then(() => queryRunner.startTransaction())
      .then(() =>
        queryRunner.manager
          .findOne(PublicationClapData, { where: { id: clapId } })
          .then((clap) => {
            if (!clap) {
              throw new Error(`Clap with id ${clapId} not found`);
            }
            return queryRunner.manager.remove(clap);
          }),
      )
      .then(() =>
        queryRunner.manager.decrement(
          VenturePublicationData,
          { id: publicationId },
          'clapsCount',
          1,
        ),
      )
      .then(() => queryRunner.commitTransaction())
      .then(() => true)
      .catch((error) => {
        this.logger.error('Error deleting clap with transaction', error.stack);
        return queryRunner.rollbackTransaction().then(() => false);
      })
      .finally(() => queryRunner.release());
  }

  public async save(
    publicationId: string,
    userId: string,
  ): Promise<PublicationClap> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newClap = queryRunner.manager.create(PublicationClapData, {
        publication: { id: publicationId } as VenturePublicationData,
        user: { id: userId } as UserData,
      });

      const savedClap = await queryRunner.manager.save(newClap);

      await queryRunner.manager.increment(
        VenturePublicationData,
        { id: publicationId },
        'clapsCount',
        1,
      );

      await queryRunner.commitTransaction();

      return JSON.parse(JSON.stringify(savedClap)) as PublicationClap;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error saving clap with transaction', error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public findByPublicationId(
    publicationId: string,
    skip: number,
    take: number,
  ): Promise<{ items: PublicationClap[]; total: number }> {
    return this.publicationClapsRepository
      .createQueryBuilder('publicationClap')
      .leftJoinAndSelect('publicationClap.user', 'user')
      .where('publicationClap.publicationId = :publicationId', {
        publicationId,
      })
      .skip(skip)
      .take(take)
      .getManyAndCount()
      .then(([items, total]) => ({
        items: JSON.parse(JSON.stringify(items)) as PublicationClap[],
        total,
      }));
  }
}
