import * as Validate from 'class-validator';

export default class PublicationCategoriesQueryDto {
  @Validate.IsString()
  @Validate.IsOptional()
  public search?: string;

  static parseQuery(query: PublicationCategoriesQueryDto) {
    return {
      search: query.search,
    };
  }
}
