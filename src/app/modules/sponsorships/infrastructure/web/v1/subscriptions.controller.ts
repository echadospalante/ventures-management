import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { VentureSubscription } from 'echadospalante-core';

import { SubscriptionsService } from '../../../domain/service/subscriptions.service';
import SubscriptionsQueryDto from './model/request/subscriptions-query.dto';

const path = '/ventures';

@Http.Controller(path)
export class SubscriptionsController {
  private readonly logger = new Logger(SubscriptionsController.name);

  public constructor(
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Http.Post('/:ventureId/subscriptions')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public createSubscription(
    @Http.Param('ventureId') ventureId: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ): Promise<VentureSubscription> {
    return this.subscriptionsService.saveSubscription(ventureId, requestedBy);
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
}
