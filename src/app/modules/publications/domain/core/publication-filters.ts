export interface PublicationFilters {
  search?: string;
  categoriesIds?: string[];
  ownerId?: string;
}

export interface OwnedEventsFilters {
  ownerEmail: string;
}
