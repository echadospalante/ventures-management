import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { EventCategoriesService } from '../../../domain/service/event-categories.service';
import EventCategoriesQueryDto from './model/request/event-categories-query.dto';
import EventCategoryCreateDto from './model/request/event-category-create.dto';

const path = '/events/categories';

@Http.Controller(path)
export class EventCategoriesController {
  private readonly logger = new Logger(EventCategoriesController.name);

  public constructor(
    private readonly eventCategoriesService: EventCategoriesService,
  ) {}

  @Http.Get('/count-stats')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getVentureCategoriesStats(
    @Http.Query() query: EventCategoriesQueryDto,
  ) {
    const filters = EventCategoriesQueryDto.parseQuery(query);
    return this.eventCategoriesService.getEventCategoriesStats(filters);
  }

  @Http.Get('')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getEventCategories(
    @Http.Query() query: EventCategoriesQueryDto,
  ) {
    const filters = EventCategoriesQueryDto.parseQuery(query);

    const [items, total] = await Promise.all([
      this.eventCategoriesService.getEventCategories(filters),
      this.eventCategoriesService.countEventCategories(filters),
    ]);
    return { items, total };
  }

  @Http.Post('')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public async createEventCategory(@Http.Body() body: EventCategoryCreateDto) {
    const { name, description } = body;
    return this.eventCategoriesService.createEventCategory(name, description);
  }

  @Http.Put('/:id')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public async updateEventCategory(
    @Http.Param('id') id: string,
    @Http.Body() body: EventCategoryCreateDto,
  ) {
    const { name, description } = body;
    return this.eventCategoriesService.updateEventCategory(id, {
      name,
      description,
    });
  }
}
