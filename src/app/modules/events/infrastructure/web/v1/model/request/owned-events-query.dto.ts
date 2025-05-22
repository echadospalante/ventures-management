import { Transform } from 'class-transformer';
import * as Validate from 'class-validator';
import { Pagination } from 'echadospalante-domain';

export default class OwnedEventsQueryDto {
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
  public page: number;

  @Transform((param) => parseInt(param.value))
  @Validate.IsNumber()
  @Validate.IsInt()
  @Validate.Min(1)
  public size: number;

  @Validate.IsEmail()
  public ownerEmail: string;

  public static parseQuery(query: OwnedEventsQueryDto) {
    const pagination: Pagination = {
      skip: query.page * query.size,
      take: query.size,
    };

    return {
      pagination,
    };
  }
}
