import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { PaginatedBody, PublicationCategory } from 'echadospalante-domain';

import { stringToSlug } from '../../../../helpers/functions/slug-generator';
import PublicationCategoryCreateDto from '../../infrastructure/web/v1/model/request/publication-category-create.dto';
import { PublicationCategoryStats } from '../core/publication-category-stats';
import { PublicationCategoriesRepository } from '../gateway/database/publication-categories.repository';

@Injectable()
export class PublicationCategoriesService {
  private readonly logger: Logger = new Logger(
    PublicationCategoriesService.name,
  );

  public constructor(
    @Inject(PublicationCategoriesRepository)
    private readonly publicationCategoriesRepository: PublicationCategoriesRepository,
  ) {}

  public findManyById(categoriesIds: string[]) {
    return this.publicationCategoriesRepository.findManyById(categoriesIds);
  }

  public getPublicationCategories(search?: string) {
    return this.publicationCategoriesRepository.findAllByCriteria(search);
  }

  public async createPublicationCategory(
    name: string,
    description: string,
  ): Promise<PublicationCategory> {
    this.logger.log(`Creating publication category ${name}`);
    const category =
      await this.publicationCategoriesRepository.findByName(name);
    const slug = stringToSlug(name);
    if (category)
      throw new ConflictException('Publication category already exists');

    const existsBySlug =
      await this.publicationCategoriesRepository.existsBySlug(name);
    if (existsBySlug)
      throw new ConflictException('Publication category already exists');

    return this.publicationCategoriesRepository.save({
      name,
      slug,
      description,
    });
  }

  public async updatePublicationCategory(
    id: string,
    categoryUpdate: PublicationCategoryCreateDto,
  ) {
    const { name: newName, description } = categoryUpdate;
    const categoryById =
      await this.publicationCategoriesRepository.findById(id);
    if (!categoryById)
      throw new NotFoundException(`Categoría con id ${id} no encontrada`);

    const slug = stringToSlug(newName);
    const categoryByName =
      await this.publicationCategoriesRepository.findByName(newName);
    if (categoryByName)
      throw new ConflictException(
        `La categoría con nombre ${newName} ya existe`,
      );
    const existsBySlug =
      await this.publicationCategoriesRepository.existsBySlug(newName);
    if (existsBySlug)
      throw new ConflictException(
        `La categoría con nombre ${newName} ya existe`,
      );
    return this.publicationCategoriesRepository.update(id, {
      name: newName,
      slug,
      description,
    });
  }

  public getPublicationCategoriesStats(): Promise<
    PaginatedBody<PublicationCategoryStats>
  > {
    return this.publicationCategoriesRepository.findCategoriesStats();
  }
}
