import * as Validate from 'class-validator';

export default class PublicationCategoryCreateDto {
  @Validate.IsString()
  @Validate.Length(3, 50)
  public name: string;

  @Validate.IsString()
  @Validate.Length(3, 200)
  public description: string;
}
