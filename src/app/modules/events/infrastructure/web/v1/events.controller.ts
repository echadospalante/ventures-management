import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { VentureEvent } from 'echadospalante-domain';

import { EventsService } from '../../../domain/service/events.service';
import EventCreateDto from './model/request/event-create.dto';
import EventsQueryDto from './model/request/events-query.dto';
import HighLightedEventsQueryDto from './model/request/highlighted-events-query';
import { UploadedPhotoResultDto } from './model/response/uploaded-photo-result.dto';

const path = '/ventures';

@Http.Controller(path)
export class VentureEventsController {
  private readonly logger = new Logger(VentureEventsController.name);

  public constructor(private readonly eventsService: EventsService) {}

  @Http.Post('/_/events/cover-photo')
  @Http.UseInterceptors(FileInterceptor('file'))
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public createVentureEventCoverPhoto(
    @Http.UploadedFile() image: Express.Multer.File,
  ): Promise<UploadedPhotoResultDto> {
    return this.eventsService.saveEventCoverPhoto(image);
  }

  // Not exposed in the gateway, only used internally
  @Http.Get('/_/events/stats/count-by-user/:email')
  public async getVentureStatsCountByUser(@Http.Param('email') email: string) {
    return this.eventsService.getEventsCountByUser(email);
  }

  @Http.Get('/_/events/highlighted')
  public async getHighlightedEvents(
    @Http.Query('search') search: string,
    @Http.Query('categoriesIds') categoriesIds: string,
    @Http.Query('municipalityId') municipalityId: number,
    @Http.Query('from') from: string,
    @Http.Query('to') to: string,
  ) {
    console.log({
      search,
      categoriesIds,
      municipalityId,
      from,
      to,
    });
    const { filters, pagination } = HighLightedEventsQueryDto.fromQueryParams(
      search,
      categoriesIds,
      from,
      to,
      municipalityId,
    );
    return this.eventsService.getHighlightedEvents(filters, pagination);
  }

  @Http.Post('/:ventureId/events')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public createVentureEvent(
    @Http.Body() body: EventCreateDto,
    @Http.Param('ventureId') ventureId: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ): Promise<VentureEvent> {
    const ventureEventCreate = EventCreateDto.toEntity(body);
    return this.eventsService.saveEvent(
      ventureEventCreate,
      ventureId,
      requestedBy,
    );
  }

  @Http.Get('/_/events')
  public async getEventsFromAllVentures(@Http.Query() query: EventsQueryDto) {
    const { pagination, filters } = EventsQueryDto.parseQuery(query);
    return this.eventsService.getEventsFromAllVentures(filters, pagination);
  }

  @Http.Get('/:ventureId/events')
  public async getVentureEvents(
    @Http.Query() query: EventsQueryDto,
    @Http.Param('ventureId') ventureId: string,
  ) {
    const { pagination, filters } = EventsQueryDto.parseQuery(query);
    return this.eventsService.getVentureEvents(ventureId, filters, pagination);
  }

  // @Http.Patch('/:id')
  // public async updateVentureEvent(
  //   @Http.Param('id') id: string,
  //   @Http.Body() body: EventUpdateDto,
  //   @Http.Headers('X-Requested-By') requestedBy: string,
  // ) {
  //   const ventureEventUpdate = EventUpdateDto.toEntity(body);

  //   return this.eventsService.updateEvent(id, requestedBy, ventureEventUpdate);
  // }

  /*

  @Http.Get('/slug/:slug')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getVentureEventBySlug(
    @Http.Param('slug') slug: string,
  ): Promise<VentureEvent> {
    console.log({ slug });
    return this.ventureEventsService.getVentureEventBySlug(slug);
  }

  @Http.Get('/owned')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getOwnedVentureEvents(@Http.Query() query: OwnedVentureEventsQueryDto) {
    const { include, filters, pagination } =
      OwnedVentureEventsQueryDto.parseQuery(query);
    console.log({ include, filters, pagination });

    const [items, total] = await Promise.all([
      this.ventureEventsService.getOwnedVentureEvents(filters, include, pagination),
      this.ventureEventsService.countOwnedVentureEvents(filters),
    ]);
    return { items, total };
  }

  // @Http.Put('/enable/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public enableVentureEvent(@Http.Param('id') id: string): Promise<VentureEvent | null> {
  //   return this.ventureEventsService.enableVentureEvent(id);
  // }

  // @Http.Put('/disable/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public disableVentureEvent(
  //   @Http.Param('id') id: string,
  // ): Promise<VentureEvent | null> {
  //   return this.ventureEventsService.disableVentureEvent(id);
  // }

  // @Http.Put('/verify/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public verifyVentureEvent(
  //   @Http.Param('id') id: string,
  // ): Promise<VentureEvent | null> {
  //   return this.ventureEventsService.verifyVentureEvent(id);
  // }

  // @Http.Put('/unverify/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public unverifyVentureEvent(
  //   @Http.Param('id') id: string,
  // ): Promise<VentureEvent | null> {
  //   return this.ventureEventsService.unverifyVentureEvent(id);
  // }

  // @Http.Put('/image/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // @UseInterceptors(FileInterceptor('file'))
  // public updateVentureEventImage(
  //   @Http.Param('id') ventureEventId: string,
  //   @Http.UploadedFile() file: Express.Multer.File,
  // ): Promise<void> {
  //   return this.ventureEventsService.updateVentureEventImage(ventureEventId, {
  //     mimetype: file.mimetype,
  //     buffer: file.buffer,
  //   });
  // }

  @Http.Delete(':id')
  @Http.HttpCode(Http.HttpStatus.NO_CONTENT)
  public deleteVentureEvent(
    @Http.Param('id') ventureEventId: string,
    @Http.Query('requestedBy') requestedBy: string,
  ): Promise<void> {
    console.log({ ventureEventId, requestedBy });
    return this.ventureEventsService.deleteVentureEventById(ventureEventId, requestedBy);
  }

  // @Http.Get('/:slug')
  // @Http.HttpCode(Http.HttpStatus.OK)
  // public getVentureEventByEmail(@Http.Param('slug') slug: string): Promise<VentureEvent> {
  //   return this.ventureEventsService.getVentureEventBySlug(slug);
  // }
  */
}
