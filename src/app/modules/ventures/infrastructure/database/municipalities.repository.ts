import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Municipality } from 'echadospalante-domain';
import { MunicipalityData } from 'echadospalante-domain/dist/app/modules/infrastructure/database/entities';
import { Repository } from 'typeorm';

import { MunicipalitiesRepository } from '../../domain/gateway/database/municipalities.repository';

@Injectable()
export class MunicipalitiesRepositoryImpl implements MunicipalitiesRepository {
  private readonly logger: Logger = new Logger(
    MunicipalitiesRepositoryImpl.name,
  );
  public constructor(
    @InjectRepository(MunicipalityData)
    private municipalityRepository: Repository<MunicipalityData>,
  ) {}

  findById(id: number): Promise<Municipality | null> {
    return this.municipalityRepository
      .findOneBy({ id })
      .then((venture) => venture as Municipality | null);
  }

  findAll(): Promise<Municipality[]> {
    return this.municipalityRepository
      .find()
      .then(
        (municipalities) =>
          JSON.parse(JSON.stringify(municipalities)) as Municipality[],
      );
  }
}
