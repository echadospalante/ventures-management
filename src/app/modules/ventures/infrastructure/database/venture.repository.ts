import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { VentureData } from 'echadospalante-core/dist/app/modules/infrastructure/database/entities';

import { VenturesRepository } from '../../domain/gateway/database/ventures.repository';
import { Venture, Pagination } from 'echadospalante-core';
import {
  OwnedVentureFilters,
  VentureFilters,
} from '../../domain/core/venture-filters';

@Injectable()
export class VenturesRepositoryImpl implements VenturesRepository {
  public constructor(
    @InjectRepository(VentureData)
    private venturesRepository: Repository<VentureData>,
  ) {}

  isVentureOwnerByEmail(ventureId: string, email: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  findById(ventureId: string): Promise<Venture | null> {
    throw new Error('Method not implemented.');
  }

  deleteById(ventureId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  countOwnedVentures(filters: OwnedVentureFilters): Promise<number> {
    throw new Error('Method not implemented.');
  }
  findBySlug(slug: string): Promise<Venture | null> {
    throw new Error('Method not implemented.');
  }

  countByCriteria(filter: VentureFilters): Promise<number> {
    throw new Error('Method not implemented.');
  }

  findAllByCriteria(
    filters: VentureFilters,
    pagination?: Pagination,
  ): Promise<Venture[]> {
    throw new Error('Method not implemented.');
  }

  findOwnedVentures(
    filters: OwnedVentureFilters,
    pagination?: Pagination,
  ): Promise<Venture[]> {
    throw new Error('Method not implemented.');
  }

  save(venture: Venture): Promise<Venture> {
    throw new Error('Method not implemented.');
  }

  existsBySlug(slug: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
