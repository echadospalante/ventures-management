import * as Validate from 'class-validator';
import { VentureCategoryFilters } from '../../../../../domain/core/venture-category-filter';

export default class VentureCategoriesQueryDto {
  @Validate.IsString()
  @Validate.IsOptional()
  public search?: string;

  static parseQuery(query: VentureCategoriesQueryDto): VentureCategoryFilters {
    return {
      search: query.search,
    };
  }
}
