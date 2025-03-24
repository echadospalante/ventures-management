import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { VentureCategoriesService } from '../../../domain/service/venture-categories.service';
import VentureCategoriesQueryDto from './model/request/venture-categories-query.dto';
import VentureCategoryCreateDto from './model/request/venture-category-create.dto';

const path = '/ventures/categories';

@Http.Controller(path)
export class VentureCategoriesController {
  private readonly logger = new Logger(VentureCategoriesController.name);

  public constructor(
    private readonly ventureCategoriesService: VentureCategoriesService,
  ) {}

  @Http.Get('')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getVentureCategories(
    @Http.Query() query: VentureCategoriesQueryDto,
  ) {
    const filters = VentureCategoriesQueryDto.parseQuery(query);

    const [items, total] = await Promise.all([
      this.ventureCategoriesService.getVentureCategories(filters),
      this.ventureCategoriesService.countVentureCategories(filters),
    ]);
    return { items, total };
  }

  @Http.Post()
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public async createVentureCategory(
    @Http.Body() body: VentureCategoryCreateDto,
  ) {
    const { name, description } = body;
    return this.ventureCategoriesService.createVentureCategory(
      name,
      description,
    );
  }

  @Http.Put('/:id')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public async updateVentureCategory(
    @Http.Param('id') id: string,
    @Http.Body() body: VentureCategoryCreateDto,
  ) {
    const { name, description } = body;
    return this.ventureCategoriesService.updateVentureCategory(id, {
      name,
      description,
    });
  }
}
