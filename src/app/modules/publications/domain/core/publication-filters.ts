export interface PublicationFilters {
  search?: string;
  ventureId?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  categoriesIds?: string[];
}

export interface OwnedEventsFilters {
  ownerEmail: string;
}
