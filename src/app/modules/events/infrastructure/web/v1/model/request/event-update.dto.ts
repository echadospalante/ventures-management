import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export default class EventUpdateDto {
  @IsString()
  public coverPhoto: string;

  @IsArray()
  public categoriesIds: string[];

  @IsEmail()
  @IsOptional()
  public contactEmail?: string;

  @IsString()
  @IsOptional()
  public contactPhoneNumber?: string;

  @IsString()
  @IsOptional()
  public locationLat?: string;

  @IsString()
  @IsOptional()
  public locationLng?: string;

  @IsString()
  @IsNotEmpty()
  public locationDescription: string;

  public static toEntity(dto: EventUpdateDto): any {
    return {
      coverPhoto: dto.coverPhoto,
      categoriesIds: dto.categoriesIds,
      contact: {
        email: dto.contactEmail,
        phoneNumber: dto.contactPhoneNumber,
      },
      location: {
        lat: dto.locationLat ? parseFloat(dto.locationLat) : undefined,
        lng: dto.locationLng ? parseFloat(dto.locationLng) : undefined,
        description: dto.locationDescription,
      },
    };
  }
}
