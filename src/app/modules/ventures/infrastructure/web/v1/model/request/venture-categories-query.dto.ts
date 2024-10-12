import { Transform } from 'class-transformer';
import * as Validate from 'class-validator';

import {
  ComplexInclude,
  Pagination,
  VentureCategory,
} from 'echadospalante-core';

import { VentureFilters } from '../../../../../domain/core/venture-filters';

export default class VentureCategoriesQueryDto {
  @Transform(({ value }) => value === 'true')
  @Validate.IsBoolean()
  @Validate.IsOptional()
  public includeUsers: boolean;

  @Transform(({ value }) => value === 'true')
  @Validate.IsBoolean()
  @Validate.IsOptional()
  public includeVentures: boolean;

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

  static parseQuery(query: VentureCategoriesQueryDto) {
    const include: ComplexInclude<VentureCategory> = {
      ventures: query.includeVentures,
      users: query.includeUsers,
    };

    const pagination: Pagination = {
      skip: query.skip,
      take: query.take,
    };

    const filters: VentureFilters = {
      search: query.search,
    };

    return {
      include,
      pagination,
      filters,
    };
  }
}
