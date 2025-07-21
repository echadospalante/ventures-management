export interface EventFilters {
  search?: string;
  categoriesIds?: string[];
  // departmentId?: number;
  municipalityId: number;
  point?: string; // Latitude,Longitude
  radius?: number; // In meters
  ownerId?: string;
  from: Date;
  to: Date;
}

export interface OwnedEventsFilters {
  ownerEmail: string;
}
