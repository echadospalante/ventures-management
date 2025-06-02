import { Transform } from 'class-transformer';
import * as Validate from 'class-validator';

import { Pagination } from 'echadospalante-domain';
import { PublicationFilters } from '../../../../../domain/core/publication-filters';

export default class PublicationsQueryDto {
  @Validate.IsNumber()
  @Validate.IsInt()
  @Transform((param) => parseInt(param.value))
  public skip: number;

  @Transform((param) => parseInt(param.value))
  @Validate.IsNumber()
  @Validate.IsInt()
  @Validate.Min(1)
  public take: number;

  @Validate.IsString()
  @Validate.IsOptional()
  public search?: string;

  @Validate.IsPositive()
  @Validate.IsOptional()
  @Validate.IsInt()
  public categoriesIds?: string[];

  @Validate.IsPositive()
  @Validate.IsOptional()
  @Validate.IsInt()
  public ownerId?: string;

  @Validate.IsString()
  @Validate.IsOptional()
  public from?: string;

  @Validate.IsString()
  @Validate.IsOptional()
  public to?: string;

  public static parseQuery(query: PublicationsQueryDto) {
    const pagination: Pagination = {
      skip: query.skip,
      take: query.take,
    };

    const filters: PublicationFilters = {
      search: query.search,
      categoriesIds: query.categoriesIds,
      dateRange:
        query.from && query.to
          ? {
              from: query.from,
              to: query.to,
            }
          : undefined,
    };

    return {
      pagination,
      filters,
    };
  }
}
