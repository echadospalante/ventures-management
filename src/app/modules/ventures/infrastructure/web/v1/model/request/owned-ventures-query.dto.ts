import { Transform } from 'class-transformer';
import * as Validate from 'class-validator';

import { ComplexInclude, Pagination, Venture } from 'echadospalante-core';
import { OwnedVentureFilters } from 'src/app/modules/ventures/domain/core/venture-filters';

export default class OwnedVenturesQueryDto {
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
  public includeLocation: boolean;

  @Transform(({ value }) => value === 'true')
  @Validate.IsBoolean()
  @Validate.IsOptional()
  public includeContact: boolean;

  @Validate.IsNumber()
  @Validate.IsInt()
  @Transform((param) => parseInt(param.value))
  public skip: number;

  @Transform((param) => parseInt(param.value))
  @Validate.IsNumber()
  @Validate.IsInt()
  @Validate.Min(1)
  public take: number;

  @Validate.IsEmail()
  public ownerEmail: string;

  public static parseQuery(query: OwnedVenturesQueryDto) {
    const include: ComplexInclude<Venture> = {
      categories: query.includeCategories,
      detail: query.includeDetail,
      contact: query.includeContact,
      location: query.includeLocation,
    };

    const pagination: Pagination = {
      skip: query.skip,
      take: query.take,
    };

    const filters: OwnedVentureFilters = {
      ownerEmail: query.ownerEmail,
    };

    return {
      include,
      pagination,
      filters,
    };
  }
}
