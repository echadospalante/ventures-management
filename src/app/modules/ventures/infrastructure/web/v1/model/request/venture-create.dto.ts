import * as Validate from 'class-validator';

export default class VentureCreateDto {
  coverPhoto: string;
  mimeType: string;
  name: string;
  description: string;
  categoriesIds: string[];
  contactEmail: string;
  contactPhoneNumber: string;
  locationLat: number;
  locationLng: number;
  ownerEmail: string;
}
