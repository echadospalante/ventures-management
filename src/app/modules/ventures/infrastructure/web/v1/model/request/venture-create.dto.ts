import * as Validate from 'class-validator';

export default class VentureCreateDto {
  @Validate.IsString()
  @Validate.IsUrl()
  @Validate.Length(3, 100)
  public name: string;

  @Validate.IsString()
  @Validate.Length(3, 255)
  public description: string;

  @Validate.IsString()
  @Validate.IsUUID(4)
  public ownerEmail: string;

  @Validate.IsArray()
  @Validate.IsInt({ each: true })
  @Validate.ArrayNotEmpty()
  @Validate.Length(1, 10)
  public categoryIds: number[];
}
