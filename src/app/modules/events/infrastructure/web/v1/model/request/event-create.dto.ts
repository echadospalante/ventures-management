import { Transform } from 'class-transformer';
import {
  IsArray,
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

  @Transform(({ value }) => parseInt(value, 10))
  @IsNotEmpty()
  public municipalityId: number;

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

  @IsArray()
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
      contactEmail: dto.contactEmail || '',
      municipalityId: dto.municipalityId,
      contactPhoneNumber: dto.contactPhoneNumber || '',
      datesAndHours: dto.datesAndHours.map((dateAndHour) => ({
        date: dateAndHour.date,
        workingRanges: dateAndHour.workingRanges.map((range) => ({
          start: range.start,
          end: range.end,
        })),
      })),
      locationLat: dto.locationLat ? dto.locationLat : '',
      locationLng: dto.locationLng ? dto.locationLng : '',
      locationDescription: dto.locationDescription,
      // location: {
      //   lat: dto.locationLat ? parseFloat(dto.locationLat) : undefined,
      //   lng: dto.locationLng ? parseFloat(dto.locationLng) : undefined,
      //   description: dto.locationDescription,
      // },
    };
  }
}
