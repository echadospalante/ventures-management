import * as Validate from 'class-validator';
import { AppRole } from 'echadospalante-domain';

export default class VentureCategoriesUpdateDto {
  @Validate.IsString()
  @Validate.IsEmail()
  public email: string;

  @Validate.IsArray()
  @Validate.IsEnum(AppRole, { each: true })
  public roles: AppRole[];
}
