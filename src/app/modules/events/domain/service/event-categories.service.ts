import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { EventCategory } from 'echadospalante-core';

import { stringToSlug } from '../../../../helpers/functions/slug-generator';
import { EventCategoryFilters } from '../core/event-category-filter';
import { EventCategoriesRepository } from '../gateway/database/event-categories.repository';
import EventCategoryCreateDto from '../../infrastructure/web/v1/model/request/event-category-create.dto';

@Injectable()
export class EventCategoriesService {
  private readonly logger: Logger = new Logger(EventCategoriesService.name);

  public constructor(
    @Inject(EventCategoriesRepository)
    private readonly usersRepository: EventCategoriesRepository,
  ) {}

  public findManyById(categoriesIds: string[]) {
    return this.usersRepository.findManyById(categoriesIds);
  }

  public getEventCategories(
    filters: EventCategoryFilters,
  ): Promise<EventCategory[]> {
    this.logger.log('Getting event categories');
    return this.usersRepository.findAllByCriteria(filters);
  }

  public countEventCategories(filters: EventCategoryFilters) {
    this.logger.log('Counting event categories');
    return this.usersRepository.count(filters);
  }

  public async createEventCategory(
    name: string,
    description: string,
  ): Promise<EventCategory> {
    this.logger.log(`Creating event category ${name}`);
    const category = await this.usersRepository.findByName(name);
    const slug = stringToSlug(name);
    if (category) throw new ConflictException('Event category already exists');

    const existsBySlug = await this.usersRepository.existsBySlug(name);
    if (existsBySlug)
      throw new ConflictException('Event category already exists');

    return this.usersRepository.save({ name, slug, description });
  }

  public async updateEventCategory(
    id: string,
    categoryUpdate: EventCategoryCreateDto,
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
}
