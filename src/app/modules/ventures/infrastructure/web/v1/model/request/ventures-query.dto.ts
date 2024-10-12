import { Transform } from 'class-transformer';
import * as Validate from 'class-validator';

import { ComplexInclude, Pagination, Venture } from 'echadospalante-core';

import { VentureFilters } from '../../../../../domain/core/venture-filters';

export default class VenturesQueryDto {
  @Transform(({ value }) => value === 'true')
  @Validate.IsBoolean()
  @Validate.IsOptional()
  public includeCategories: boolean;

  @Transform(({ value }) => value === 'true')
  @Validate.IsBoolean()
  @Validate.IsOptional()
  public includeDetail: boolean;

  @Transform(({ value }) => value === 'true')
  @Validate.IsBoolean()
  @Validate.IsOptional()
  public includeOwner: boolean;

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
  public categoryId?: number;

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

  static parseQuery(query: VenturesQueryDto) {
    const include: ComplexInclude<Venture> = {
      categories: query.includeCategories,
      detail: query.includeDetail,
      ownerDetail: false,
      contact: false,
      location: false,
    };

    const pagination: Pagination = {
      skip: query.skip,
      take: query.take,
    };

    const filters: VentureFilters = {
      search: query.search,
      categoryId: query.categoryId,
      departmentId: query.departmentId,
      municipalityId: query.municipalityId,
      point: query.point,
      radius: query.radius,
      ownerId: query.ownerId,
    };

    return {
      include,
      pagination,
      filters,
    };
  }
}
