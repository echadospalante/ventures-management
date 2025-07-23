import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { EventDonationsService } from '../../../domain/service/event-donations.service';

const path = '/events';

@Http.Controller(path)
export class EventDonationsController {
  private readonly logger = new Logger(EventDonationsController.name);

  public constructor(
    private readonly eventDonationsService: EventDonationsService,
  ) {}

  @Http.Get('/_/donations/sent')
  public async getSentEventDonations(
    @Http.Headers('X-Requested-By') requesterEmail: string,
    @Http.Query('skip') skip: number,
    @Http.Query('take') take: number,
  ) {
    return this.eventDonationsService.getSentEventDonations(
      requesterEmail,
      skip,
      take,
    );
  }

  // Not exposed in the gateway, only used internally
  @Http.Get('/_/donations/stats/given-count-by-user/:email')
  public async getDonationsStatsGivenCount(@Http.Param('email') email: string) {
    return this.eventDonationsService.getDonationsGivenCountByUserEmail(email);
  }

  // Not exposed in the gateway, only used internally
  @Http.Get('/_/donations/stats/received-count-by-user/:email')
  public async getDonationsStatsReceivedCount(
    @Http.Param('email') email: string,
  ) {
    return this.eventDonationsService.getDonationsReceivedCountByUserEmail(
      email,
    );
  }

  @Http.Get('/_/donations/received')
  public async getReceivedEventDonations(
    @Http.Headers('X-Requested-By') requesterEmail: string,
    @Http.Query('skip') skip: number,
    @Http.Query('take') take: number,
  ) {
    return this.eventDonationsService.getReceivedEventDonations(
      requesterEmail,
      skip,
      take,
    );
  }

  @Http.Get('/:eventId/donations')
  public async getEventDonations(
    @Http.Param('eventId') eventId: string,
    @Http.Query('skip') skip: number,
    @Http.Query('take') take: number,
  ) {
    return this.eventDonationsService.getEventDonations(eventId, skip, take);
  }

  @Http.Post('/:eventId/donations')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public async createEventDonation(
    @Http.Param('eventId') eventId: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
    @Http.Body() body: { amount: number },
  ) {
    return this.eventDonationsService.createDonation(
      eventId,
      requestedBy,
      body.amount,
    );
  }
}
