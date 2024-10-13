import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';

import {
  ComplexInclude,
  Pagination,
  VentureCategory,
} from 'echadospalante-core';

import { VentureCategoriesRepository } from '../gateway/database/venture-categories.repository';
import { stringToSlug } from '../../../../helpers/functions/slug-generator';
import { VentureCategoryFilters } from '../core/venture-category-filter';
import { VentureFilters } from '../core/venture-filters';

@Injectable()
export class VentureCategoriesService {
  
  private readonly logger: Logger = new Logger(VentureCategoriesService.name);

  public constructor(
    @Inject(VentureCategoriesRepository)
    private readonly usersRepository: VentureCategoriesRepository,
  ) {}

  public getVentureCategories(
    filters: VentureCategoryFilters,
    include: ComplexInclude<VentureCategory>,
    pagination: Pagination,
  ): Promise<VentureCategory[]> {
    this.logger.log('Getting venture categories');
    return this.usersRepository.findAllByCriteria(filters, include, pagination);
  }

  public countVentureCategories(filters: VentureFilters) {
    this.logger.log('Counting venture categories');
    return this.usersRepository.count(filters);
  }

  public async createVentureCategory(
    name: string,
    description: string,
  ): Promise<VentureCategory> {
    this.logger.log(`Creating venture category ${name}`);
    const category = await this.usersRepository.findByName(name, {});
    const slug = stringToSlug(name);
    if (category)
      throw new ConflictException('Venture category already exists');

    const existsBySlug = await this.usersRepository.existsBySlug(name);
    if (existsBySlug)
      throw new ConflictException('Venture category already exists');

    return this.usersRepository.save({ name, slug, description }, {});
  }
}
