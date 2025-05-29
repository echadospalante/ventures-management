import {
  IsArray,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventCreate } from 'echadospalante-domain';

export default class EventCreateDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

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

  @IsDefined()
  public datesAndHours: {
    date: string;
    workingRanges: {
      start: string;
      end: string;
    }[];
  }[];

  public static toEntity(dto: EventCreateDto): EventCreate {
    return {
      title: dto.title,
      coverPhoto: dto.coverPhoto,
      description: dto.description,
      categoriesIds: dto.categoriesIds,
      contactEmail: dto.contactEmail,
      contactPhoneNumber: dto.contactPhoneNumber,
      datesAndHours: dto.datesAndHours.map((dateAndHour) => ({
        date: dateAndHour.date,
        workingRanges: dateAndHour.workingRanges.map((range) => ({
          start: range.start,
          end: range.end,
        })),
      })),
      location: {
        lat: dto.locationLat ? parseFloat(dto.locationLat) : undefined,
        lng: dto.locationLng ? parseFloat(dto.locationLng) : undefined,
        description: dto.locationDescription,
      },
    };
  }
}
