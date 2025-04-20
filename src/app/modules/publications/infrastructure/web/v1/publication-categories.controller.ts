import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { PublicationCategoriesService } from '../../../domain/service/publication-categories.service';
import PublicationCategoriesQueryDto from './model/request/publication-categories-query.dto';
import PublicationCategoryCreateDto from './model/request/publication-category-create.dto';

const path = '/publications/categories';

@Http.Controller(path)
export class PublicationCategoriesController {
  private readonly logger = new Logger(PublicationCategoriesController.name);

  public constructor(
    private readonly publicationCategoriesService: PublicationCategoriesService,
  ) {}

  @Http.Get('')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getPublicationCategories(
    @Http.Query() query: PublicationCategoriesQueryDto,
  ) {
    const filters = PublicationCategoriesQueryDto.parseQuery(query);
    return this.publicationCategoriesService.getPublicationCategories(
      filters.search,
    );
  }

  @Http.Post('')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public async createPublicationCategory(
    @Http.Body() body: PublicationCategoryCreateDto,
  ) {
    const { name, description } = body;
    return this.publicationCategoriesService.createPublicationCategory(
      name,
      description,
    );
  }

  @Http.Put('/:id')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public async updatePublicationCategory(
    @Http.Param('id') id: string,
    @Http.Body() body: PublicationCategoryCreateDto,
  ) {
    const { name, description } = body;
    return this.publicationCategoriesService.updatePublicationCategory(id, {
      name,
      description,
    });
  }
}
