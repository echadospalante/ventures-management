import * as Validate from 'class-validator';
import { EventCategoryFilters } from '../../../../../domain/core/event-category-filter';

export default class EventCategoriesQueryDto {
  @Validate.IsString()
  @Validate.IsOptional()
  public search?: string;

  static parseQuery(query: EventCategoriesQueryDto): EventCategoryFilters {
    return {
      search: query.search,
    };
  }
}
