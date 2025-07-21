import { Transform } from 'class-transformer';
import * as Validate from 'class-validator';

import { Pagination } from 'echadospalante-domain';

export default class OwnedSubscriptionsQueryDto {
  @Validate.IsNumber()
  @Validate.IsInt()
  @Transform((param) => parseInt(param.value))
  public skip: number;

  @Transform((param) => parseInt(param.value))
  @Validate.IsNumber()
  @Validate.IsInt()
  @Validate.Min(1)
  public take: number;

  public static parseQuery(query: OwnedSubscriptionsQueryDto) {
    const pagination: Pagination = {
      skip: query.skip,
      take: query.take,
    };

    return {
      pagination,
    };
  }
}
