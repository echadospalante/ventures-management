import * as Validate from 'class-validator';
import { Pagination } from 'echadospalante-domain';

import { PublicationFilters } from '../../../../../domain/core/publication-filters';

export default class HighLightedPublicationsQueryDto {
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
  ) {
    console.log({ search, categoriesIds, from, to });
    const pagination: Pagination = {
      skip: 0,
      take: 10,
    };

    const filters: PublicationFilters = {
      search: search,
      categoriesIds: categoriesIds
        ? categoriesIds.split(',').map((id) => id)
        : [],
      ventureId: undefined, // This is not used in highlighted publications
      dateRange:
        from && to
          ? {
              from: from,
              to: to,
            }
          : undefined,
    };

    return {
      pagination,
      filters,
    };
  }
}
