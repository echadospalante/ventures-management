import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { VentureSubscription } from 'echadospalante-domain';

import { VentureSubscriptionsService } from '../../../domain/service/venture-subscriptions.service';
import SubscriptionsQueryDto from './model/request/subscriptions-query.dto';
import OwnedSubscriptionsQueryDto from './model/request/owned-subscriptions-query.dto';

const path = '/ventures';

@Http.Controller(path)
export class SubscriptionsController {
  private readonly logger = new Logger(SubscriptionsController.name);

  public constructor(
    private readonly subscriptionsService: VentureSubscriptionsService,
  ) {}

  // Not exposed in the gateway, only used internally
  @Http.Get('/_/subscriptions/stats/count-by-user/:email')
  public async getVentureStatsCountByUser(@Http.Param('email') email: string) {
    return this.subscriptionsService.getSubscriptionsCountByUser(email);
  }

  // Not exposed in the gateway, only used internally
  @Http.Get('/_/subscribers/stats/count-by-user/:email')
  public async getSubscribersStatsCountByUser(
    @Http.Param('email') email: string,
  ) {
    return this.subscriptionsService.getSubscribersCountByUser(email);
  }

  @Http.Get('/owned/subscriptions/stats')
  public async getUserSubscriptionsStats(
    @Http.Headers('X-Requested-By') requesterEmail: string,
  ) {
    console.log('Getting user subscriptions stats for', requesterEmail);
    return this.subscriptionsService.getOwnedSubscriptionsStats(requesterEmail);
  }

  @Http.Get('/owned/subscriptions/:ventureCategoryId')
  public async getUserSubscriptions(
    @Http.Headers('X-Requested-By') requesterEmail: string,
    @Http.Query() query: OwnedSubscriptionsQueryDto,
    @Http.Param('ventureCategoryId') ventureCategoryId: string,
  ) {
    const { pagination } = OwnedSubscriptionsQueryDto.parseQuery(query);
    return this.subscriptionsService.getOwnedSubscriptions(
      ventureCategoryId,
      requesterEmail,
      pagination,
    );
  }

  @Http.Post('/:ventureId/subscriptions')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public createSubscription(
    @Http.Param('ventureId') ventureId: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ): Promise<VentureSubscription> {
    return this.subscriptionsService.saveSubscription(ventureId, requestedBy);
  }

  @Http.Delete('/:ventureId/subscriptions')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public deleteSubscription(
    @Http.Param('ventureId') ventureId: string,
    // @Http.Param('subscriptionId') subscriptionId: string,
    @Http.Headers('X-Requested-By') requesterEmail: string,
  ) {
    return this.subscriptionsService
      .deleteSubscription(ventureId, requesterEmail)
      .then((deleted) => ({ deleted }));
  }

  @Http.Get('/:ventureId/subscriptions')
  public async getVentureSubscriptions(
    @Http.Param('ventureId') ventureId: string,
    @Http.Query() query: SubscriptionsQueryDto,
  ) {
    const { pagination } = SubscriptionsQueryDto.parseQuery(query);
    return this.subscriptionsService.getVentureSubscriptions(
      ventureId,
      pagination,
    );
  }

  @Http.Get('/:ventureId/subscription-status')
  public async getVentureSubscriptionStatus(
    @Http.Param('ventureId') ventureId: string,
    @Http.Headers('X-Requested-By') requesterEmail: string,
  ) {
    return this.subscriptionsService
      .getVentureSubscriptionStatus(ventureId, requesterEmail)
      .then((status) => ({ subscribed: status }));
  }
}
