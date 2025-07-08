import { Transform } from 'class-transformer';
import * as Validate from 'class-validator';

import { Pagination } from 'echadospalante-domain';

import { VentureFilters } from '../../../../../domain/core/venture-filters';

export default class OwnedVenturesQueryDto {
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

  @Validate.IsOptional()
  @Validate.IsArray()
  @Validate.IsString({ each: true })
  public categoryIds?: string[];

  @Validate.IsPositive()
  @Validate.IsOptional()
  @Validate.IsInt()
  public ownerId?: string;

  @Validate.IsOptional()
  @Validate.IsArray()
  @Validate.IsInt({ each: true })
  @Validate.IsPositive({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : []))
  public municipalitiesIds?: number[];

  public static parseQuery(
    query: OwnedVenturesQueryDto /* requesterEmail: string */,
  ) {
    const pagination: Pagination = {
      skip: query.skip,
      take: query.take,
    };

    const filters: VentureFilters = {
      search: query.search,
      categoriesIds: query.categoryIds,
      municipalitiesIds: query.municipalitiesIds || [],
      ownerEmail: query.ownerId,
    };

    return {
      pagination,
      filters,
    };
  }
}
