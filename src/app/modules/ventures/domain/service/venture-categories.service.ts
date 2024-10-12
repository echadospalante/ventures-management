import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';

import { VentureCategory } from 'echadospalante-core';

import { VentureCategoriesRepository } from '../gateway/database/venture-categories.repository';
import { stringToSlug } from '../../../../helpers/functions/slug-generator';

@Injectable()
export class VentureCategoriesService {
  private readonly logger: Logger = new Logger(VentureCategoriesService.name);

  public constructor(
    @Inject(VentureCategoriesRepository)
    private readonly usersRepository: VentureCategoriesRepository,
  ) {}

  public getVentureCategories(): Promise<VentureCategory[]> {
    this.logger.log('Getting all venture categories');
    return this.usersRepository.findAll({});
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
