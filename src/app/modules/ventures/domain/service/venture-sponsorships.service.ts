import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { VentureSponsorshipsRepository } from '../gateway/database/venture-sponsorships.repository';
import { UserHttpService } from '../gateway/http/http.gateway';

@Injectable()
export class VentureSponsorshipsService {
  private readonly logger: Logger = new Logger(VentureSponsorshipsService.name);

  public constructor(
    @Inject(VentureSponsorshipsRepository)
    private ventureSponsorshipsRepository: VentureSponsorshipsRepository,
    @Inject(UserHttpService)
    private readonly userHttpService: UserHttpService,
  ) {}

  public async createSponsorship(
    ventureId: string,
    amount: number,
    requestedBy: string,
  ) {
    try {
      const sponsor = await this.userHttpService.getUserByEmail(requestedBy);

      return this.ventureSponsorshipsRepository.save(
        ventureId,
        sponsor.id,
        amount,
      );
    } catch (error) {
      this.logger.error(
        `Error saving sponsorship for venture ${ventureId}: ${error.message}`,
        error.stack,
      );
      throw new NotFoundException(`Venture with id ${ventureId} not found`);
    }
  }

  public async cancelSponsorship(
    ventureId: string,
    sponsorshipId: string,
    requestedBy: string,
  ): Promise<boolean> {
    const sponsorship =
      await this.ventureSponsorshipsRepository.findById(sponsorshipId);
    if (!sponsorship) {
      throw new NotFoundException(
        `Sponsorship with id ${sponsorshipId} not found`,
      );
    }
    if (sponsorship.sponsor!.email !== requestedBy) {
      throw new NotFoundException(
        `Sponsorship with id ${sponsorshipId} does not belong to user ${requestedBy}`,
      );
    }
    return this.ventureSponsorshipsRepository.cancel(ventureId, sponsorshipId);
  }

  public getVentureSponsorships(ventureId: string, skip: number, take: number) {
    return this.ventureSponsorshipsRepository.findManyByVenture(
      ventureId,
      skip,
      take,
    );
  }

  public getSentVentureSponsorships(
    requesterEmail: string,
    skip: number,
    take: number,
  ) {
    return this.ventureSponsorshipsRepository.findManySent(
      requesterEmail,
      skip,
      take,
    );
  }

  public getReceivedVentureSponsorships(
    requesterEmail: string,
    skip: number,
    take: number,
  ) {
    return this.ventureSponsorshipsRepository.findManyReceived(
      requesterEmail,
      skip,
      take,
    );
  }

  public getSponsorshipsGivenCountByUserEmail(email: string) {
    return this.ventureSponsorshipsRepository
      .getSponsorshipsGivenCountByUser(email)
      .then((result) => ({ result }));
  }

  public getSponsorshipsReceivedCountByUserEmail(email: string) {
    return this.ventureSponsorshipsRepository
      .getSponsorshipsReceivedCountByUser(email)
      .then((result) => ({ result }));
  }

  public getSponsorshipStatus(ventureId: string, requesterEmail: string) {
    return this.ventureSponsorshipsRepository
      .getSponsorshipStatus(ventureId, requesterEmail)
      .then((result) => result);
  }
}
