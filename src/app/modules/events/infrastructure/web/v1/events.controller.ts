import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { VentureEvent } from 'echadospalante-core';

import { UploadedPhotoResultDto } from './model/response/uploaded-photo-result.dto';
import { EventsService } from '../../../domain/service/events.service';
import EventUpdateDto from './model/request/event-update.dto';
import EventsQueryDto from './model/request/events-query.dto';
import EventCreateDto from './model/request/event-create.dto';

const path = '/events';

@Http.Controller(path)
export class VentureEventsController {
  private readonly logger = new Logger(VentureEventsController.name);

  public constructor(private readonly eventsService: EventsService) {}

  @Http.Post('/cover-photo')
  @Http.UseInterceptors(FileInterceptor('file'))
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public createVentureEventCoverPhoto(
    @Http.UploadedFile() image: Express.Multer.File,
  ): Promise<UploadedPhotoResultDto> {
    return this.eventsService.saveEventCoverPhoto(image);
  }

  @Http.Post('')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public createVentureEvent(
    @Http.Body() body: EventCreateDto,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ): Promise<VentureEvent> {
    const ventureEventCreate = EventCreateDto.toEntity(body);
    return this.eventsService.saveEvent(ventureEventCreate, requestedBy);
  }

  @Http.Get('')
  public async getVentureEvents(@Http.Query() query: EventsQueryDto) {
    const { pagination, filters } = EventsQueryDto.parseQuery(query);
    console.log(filters);
    return this.eventsService.getEvents(filters, pagination);
  }

  @Http.Patch('/:id')
  public async updateVentureEvent(
    @Http.Param('id') id: string,
    @Http.Body() body: EventUpdateDto,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ) {
    const ventureEventUpdate = EventUpdateDto.toEntity(body);

    return this.eventsService.updateEvent(id, requestedBy, ventureEventUpdate);
  }

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
