import * as Validate from 'class-validator';
import { Pagination } from 'echadospalante-domain';

import { EventFilters } from './../../../../../domain/core/event-filters';

export default class HighLightedEventsQueryDto {
  @Validate.IsString()
  @Validate.IsOptional()
  public search?: string;

  @Validate.IsPositive()
  @Validate.IsOptional()
  @Validate.IsInt()
  public categoriesIds?: string[];

  static fromQueryParams(
    search: string,
    categoriesIds: string,
    from: string,
    to: string,
    municipalityId: number,
  ) {
    const pagination: Pagination = {
      skip: 0,
      take: 10,
    };

    const filters: EventFilters = {
      search: search,
      categoriesIds: categoriesIds
        ? categoriesIds.split(',').map((id) => id)
        : [],
      from: new Date(from),
      to: new Date(to),
      municipalityId,
    };

    return {
      pagination,
      filters,
    };
  }
}
