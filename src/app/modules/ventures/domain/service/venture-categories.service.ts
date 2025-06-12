import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  PaginatedBody,
  VentureCategory,
  VentureCategoryStats,
} from 'echadospalante-domain';

import { stringToSlug } from '../../../../helpers/functions/slug-generator';
import VentureCategoryCreateDto from '../../infrastructure/web/v1/model/request/venture-category-create.dto';
import { VentureCategoryFilters } from '../core/venture-category-filter';
import { VentureCategoriesRepository } from '../gateway/database/venture-categories.repository';

@Injectable()
export class VentureCategoriesService {
  private readonly logger: Logger = new Logger(VentureCategoriesService.name);

  public constructor(
    @Inject(VentureCategoriesRepository)
    private readonly usersRepository: VentureCategoriesRepository,
  ) {}

  public getVentureCategories(filters: VentureCategoryFilters) {
    this.logger.log('Getting venture categories');
    return this.usersRepository.findAllByCriteria(filters);
  }

  public async createVentureCategory(
    name: string,
    description: string,
  ): Promise<VentureCategory> {
    this.logger.log(`Creating venture category ${name}`);
    const category = await this.usersRepository.findByName(name);
    const slug = stringToSlug(name);
    if (category)
      throw new ConflictException('Venture category already exists');

    const existsBySlug = await this.usersRepository.existsBySlug(name);
    if (existsBySlug)
      throw new ConflictException('Venture category already exists');

    return this.usersRepository.save({ name, slug, description });
  }

  public async updateVentureCategory(
    id: string,
    categoryUpdate: VentureCategoryCreateDto,
  ) {
    const { name: newName, description } = categoryUpdate;
    const categoryById = await this.usersRepository.findById(id);
    if (!categoryById)
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);

    const slug = stringToSlug(newName);
    const categoryByName = await this.usersRepository.findByName(newName);
    if (categoryByName)
      throw new ConflictException(
        `La categoría con nombre ${newName} ya existe`,
      );
    const existsBySlug = await this.usersRepository.existsBySlug(newName);
    if (existsBySlug)
      throw new ConflictException(
        `La categoría con nombre ${newName} ya existe`,
      );
    return this.usersRepository.update(id, {
      name: newName,
      slug,
      description,
    });
  }

  public getVentureCategoriesStats(
    filters: VentureCategoryFilters,
  ): Promise<PaginatedBody<VentureCategoryStats>> {
    return this.usersRepository.findCategoriesStats(filters);
  }
}
