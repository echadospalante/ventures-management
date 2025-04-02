import { Transform } from 'class-transformer';
import * as Validate from 'class-validator';

import { Pagination } from 'echadospalante-core';

import { EventFilters } from '../../../../../domain/core/event-filters';

export default class EventsQueryDto {
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
  public categoryIds?: string[];

  @Validate.IsPositive()
  @Validate.IsOptional()
  @Validate.IsInt()
  public ownerId?: string;

  @Validate.IsPositive()
  @Validate.IsOptional()
  @Validate.IsInt()
  public departmentId?: number;

  @Validate.IsPositive()
  @Validate.IsOptional()
  @Validate.IsInt()
  public municipalityId?: number;

  // latitude,longitude
  @Validate.IsString()
  @Validate.IsOptional()
  @Validate.Matches(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/)
  public point?: string;

  @Validate.IsPositive()
  @Validate.IsOptional()
  @Validate.IsInt()
  public radius?: number;

  public static parseQuery(query: EventsQueryDto) {
    const pagination: Pagination = {
      skip: query.skip,
      take: query.take,
    };

    const filters: EventFilters = {
      search: query.search,
      categoriesIds: query.categoryIds,
      departmentId: query.departmentId,
      municipalityId: query.municipalityId,
      point: query.point,
      radius: query.radius,
      ownerId: query.ownerId,
    };

    return {
      pagination,
      filters,
    };
  }
}
