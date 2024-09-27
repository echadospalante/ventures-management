export interface VentureFilters {
  search?: string;
  categoryId?: number;
  departmentId?: number;
  municipalityId?: number;
  point?: string; // Latitude,Longitude
  radius?: number; // In meters
  ownerId?: string;
}
