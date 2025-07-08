import * as Validate from 'class-validator';

import { VentureFilters } from '../../../../../domain/core/venture-filters';
import { Transform } from 'class-transformer';

export default class VenturesMapQueryDto {
  @Validate.IsString()
  @Validate.IsOptional()
  public search?: string;

  @Validate.IsOptional()
  @Validate.IsArray()
  @Validate.IsString({ each: true })
  public categoryIds?: string[];

  @Validate.IsOptional()
  @Validate.IsPositive()
  @Validate.IsInt()
  public ownerId?: string;

  @Transform(({ value }) => parseInt(value, 10))
  @Validate.IsInt()
  @Validate.IsPositive()
  public municipalityId: number;

  public static parseQuery(
    query: VenturesMapQueryDto /* requesterEmail: string */,
  ) {
    const filters: VentureFilters = {
      search: query.search,
      categoriesIds: query.categoryIds,
      municipalitiesIds: [query.municipalityId],
      ownerEmail: query.ownerId,
    };

    return {
      filters,
    };
  }
}
