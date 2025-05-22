import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { EventDonationsService } from '../../../domain/service/event-donarions.service';

const path = '/events';

@Http.Controller(path)
export class EventDonationsController {
  private readonly logger = new Logger(EventDonationsController.name);

  public constructor(
    private readonly eventDonationsService: EventDonationsService,
  ) {}

  @Http.Post('/:eventId/donations')
  public async createEventDonation(
    @Http.Param('eventId') eventId: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
    @Http.Body() body: { amount: number; currency: string },
  ) {
    return this.eventDonationsService.createDonation(
      eventId,
      requestedBy,
      body.amount,
      body.currency,
    );
  }

  @Http.Get('/:eventId/donations')
  public async getEventDonations(@Http.Param('eventId') eventId: string) {
    return this.eventDonationsService.getEventDonations(eventId);
  }
}
