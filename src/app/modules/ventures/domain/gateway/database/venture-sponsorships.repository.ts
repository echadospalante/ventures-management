import { VentureSponsorship, PaginatedBody } from 'echadospalante-domain';

export interface VentureSponsorshipsRepository {
  findById(sponsorshipId: string): Promise<VentureSponsorship | null>;
  findManySent(
    userEmail: string,
    skip: number,
    take: number,
  ): Promise<PaginatedBody<VentureSponsorship>>;
  findManyReceived(
    userEmail: string,
    skip: number,
    take: number,
  ): Promise<PaginatedBody<VentureSponsorship>>;
  findManyByVenture(
    ventureId: string,
    skip: number,
    take: number,
  ): Promise<PaginatedBody<VentureSponsorship>>;
  save(
    ventureId: string,
    sponsorId: string,
    amount: number,
  ): Promise<VentureSponsorship>;

  cancel(ventureId: string, sponsorshipId: string): Promise<boolean>;
}

export const VentureSponsorshipsRepository = Symbol(
  'VentureSponsorshipsRepository',
);
