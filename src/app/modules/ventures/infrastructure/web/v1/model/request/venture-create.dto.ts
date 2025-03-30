import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { VentureCreate } from 'echadospalante-core';

export default class VentureCreateDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  public description: string;

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

  public static toEntity(dto: VentureCreateDto): VentureCreate {
    return {
      name: dto.name,
      coverPhoto: dto.coverPhoto,
      description: dto.description,
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
