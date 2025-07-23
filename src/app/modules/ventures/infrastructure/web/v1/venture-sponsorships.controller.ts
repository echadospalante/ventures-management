import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { VentureSponsorshipsService } from '../../../domain/service/venture-sponsorships.service';

const path = '/ventures';

@Http.Controller(path)
export class VentureSponsorshipsController {
  private readonly logger = new Logger(VentureSponsorshipsController.name);

  public constructor(
    private readonly ventureSponsorshipsService: VentureSponsorshipsService,
  ) {}

  @Http.Get('/:ventureId/sponsorships/status')
  public async getSponsorshipStatus(
    @Http.Param('ventureId') ventureId: string,
    @Http.Headers('X-Requested-By') requesterEmail: string,
  ) {
    return this.ventureSponsorshipsService.getSponsorshipStatus(
      ventureId,
      requesterEmail,
    );
  }

  // Not exposed in the gateway, only used internally
  @Http.Get('/_/sponsorships/stats/given-count-by-user/:email')
  public async getSponsorshipsStatsGivenCount(
    @Http.Param('email') email: string,
  ) {
    return this.ventureSponsorshipsService.getSponsorshipsGivenCountByUserEmail(
      email,
    );
  }

  // Not exposed in the gateway, only used internally
  @Http.Get('/_/sponsorships/stats/received-count-by-user/:email')
  public async getSponsorshipsStatsReceivedCount(
    @Http.Param('email') email: string,
  ) {
    return this.ventureSponsorshipsService.getSponsorshipsReceivedCountByUserEmail(
      email,
    );
  }

  @Http.Get('/_/sponsorships/sent')
  public async getSentVentureSponsorships(
    @Http.Headers('X-Requested-By') requesterEmail: string,
    @Http.Query('skip') skip: number,
    @Http.Query('take') take: number,
  ) {
    return this.ventureSponsorshipsService.getSentVentureSponsorships(
      requesterEmail,
      skip,
      take,
    );
  }

  @Http.Get('/_/sponsorships/received')
  public async getReceivedVentureSponsorships(
    @Http.Headers('X-Requested-By') requesterEmail: string,
    @Http.Query('skip') skip: number,
    @Http.Query('take') take: number,
  ) {
    return this.ventureSponsorshipsService.getReceivedVentureSponsorships(
      requesterEmail,
      skip,
      take,
    );
  }

  @Http.Get('/:ventureId/sponsorships')
  public async getVentureSponsorships(
    @Http.Param('ventureId') ventureId: string,
    @Http.Query('skip') skip: number,
    @Http.Query('take') take: number,
  ) {
    return this.ventureSponsorshipsService.getVentureSponsorships(
      ventureId,
      skip,
      take,
    );
  }

  @Http.Post('/:ventureId/sponsorships')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public async createVentureSponsorship(
    @Http.Param('ventureId') ventureId: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
    @Http.Body() body: { monthlyAmount: number },
  ) {
    return this.ventureSponsorshipsService.createSponsorship(
      ventureId,
      body.monthlyAmount,
      requestedBy,
    );
  }

  @Http.Delete('/:ventureId/sponsorships/:sponsorshipId')
  @Http.HttpCode(Http.HttpStatus.NO_CONTENT)
  public async deleteVentureSponsorship(
    @Http.Param('ventureId') ventureId: string,
    @Http.Param('sponsorshipId') sponsorshipId: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ) {
    return this.ventureSponsorshipsService.cancelSponsorship(
      ventureId,
      sponsorshipId,
      requestedBy,
    );
  }
}
