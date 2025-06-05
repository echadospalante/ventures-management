export interface VentureFilters {
  search?: string;
  categoriesIds?: string[];
  departmentId?: number;
  municipalityId?: number;
  point?: string; // Latitude,Longitude
  radius?: number; // In meters
  ownerEmail?: string;
}

export interface OwnedVentureFilters {
  ownerEmail: string;
}
