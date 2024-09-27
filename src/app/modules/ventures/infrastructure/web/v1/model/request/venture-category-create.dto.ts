import * as Validate from 'class-validator';

export default class VentureCategoryCreateDto {
  @Validate.IsString()
  @Validate.Length(3, 50)
  public name: string;
}
