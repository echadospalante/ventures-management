import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { PublicationContent, PublicationCreate } from 'echadospalante-domain';

export default class PublicationCreateDto {
  @IsString()
  description: string;

  @IsArray()
  @IsNotEmpty()
  body: PublicationContent[];

  @IsArray()
  @IsNotEmpty()
  categoriesIds: string[];

  public static toEntity(dto: PublicationCreateDto): PublicationCreate {
    return {
      description: dto.description,
      categoriesIds: dto.categoriesIds,
      contents: dto.body,
    };
  }
}
