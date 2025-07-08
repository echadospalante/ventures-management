import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { VenturesService } from '../../../domain/service/ventures.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Venture } from 'echadospalante-domain';
import VentureCreateDto from './model/request/venture-create.dto';
import { UploadedPhotoResultDto } from './model/response/uploaded-photo-result.dto';
import VenturesQueryDto from './model/request/ventures-query.dto';
import VentureUpdateDto from './model/request/venture-update.dto';
import VenturesMapQueryDto from './model/request/ventures-map-query.dto';
import OwnedVenturesQueryDto from './model/request/owned-ventures-query.dto';

const path = '/ventures';

@Http.Controller(path)
export class VenturesController {
  private readonly logger = new Logger(VenturesController.name);

  public constructor(private readonly venturesService: VenturesService) {}

  @Http.Post('/cover-photo')
  @Http.UseInterceptors(FileInterceptor('file'))
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public createVentureCoverPhoto(
    @Http.UploadedFile() image: Express.Multer.File,
  ): Promise<UploadedPhotoResultDto> {
    console.log({ image });
    return this.venturesService.saveVentureCoverPhoto(image);
  }

  @Http.Post('')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public createVenture(
    @Http.Body() body: VentureCreateDto,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ): Promise<Venture> {
    console.log({ requestedBy, body });
    const ventureCreate = VentureCreateDto.toEntity(body);
    return this.venturesService.saveVenture(ventureCreate, requestedBy);
  }

  @Http.Get('')
  public async getVentures(
    @Http.Query() query: VenturesQueryDto,
    // @Http.Headers('X-Requested-By') requesterEmail: string,
  ) {
    const { pagination, filters } = VenturesQueryDto.parseQuery(
      query,
      // requesterEmail,
    );

    return this.venturesService.getVentures(filters, pagination);
  }

  @Http.Get('/owned')
  public async getOwnedVentures(
    @Http.Query() query: OwnedVenturesQueryDto,
    @Http.Headers('X-Requested-By') requesterEmail: string,
  ) {
    const { pagination, filters } = OwnedVenturesQueryDto.parseQuery(
      query,
      requesterEmail,
    );

    return this.venturesService.getOwnedVentures(filters, pagination);
  }

  @Http.Get('/map')
  public async getVenturesForMap(
    @Http.Query() query: VenturesMapQueryDto,
    // @Http.Headers('X-Requested-By') requesterEmail: string,
  ) {
    const { filters } = VenturesMapQueryDto.parseQuery(query);

    return this.venturesService.getVenturesForMap(filters);
  }

  @Http.Get('/:ventureId/stats')
  public async getVentureStats(@Http.Param('ventureId') ventureId: string) {
    return this.venturesService.getVenturesStats(ventureId);
  }

  @Http.Get('/:ventureId')
  public async getVentureDetail(@Http.Param('ventureId') ventureId: string) {
    return this.venturesService.getVentureDetail(ventureId);
  }

  @Http.Get('/slug/:ventureSlug')
  public async getVentureDetailBySlug(
    @Http.Param('ventureSlug') ventureSlug: string,
  ) {
    return this.venturesService.getVentureDetailBySlug(ventureSlug);
  }

  @Http.Patch('/:id')
  public async updateVenture(
    @Http.Param('id') id: string,
    @Http.Body() body: VentureUpdateDto,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ) {
    const ventureUpdate = VentureUpdateDto.toEntity(body);

    return this.venturesService.updateVenture(id, requestedBy, ventureUpdate);
  }

  /*

  @Http.Get('/slug/:slug')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getVentureBySlug(
    @Http.Param('slug') slug: string,
  ): Promise<Venture> {
    console.log({ slug });
    return this.venturesService.getVentureBySlug(slug);
  }

  @Http.Get('/owned')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getOwnedVentures(@Http.Query() query: OwnedVenturesQueryDto) {
    const { include, filters, pagination } =
      OwnedVenturesQueryDto.parseQuery(query);
    console.log({ include, filters, pagination });

    const [items, total] = await Promise.all([
      this.venturesService.getOwnedVentures(filters, include, pagination),
      this.venturesService.countOwnedVentures(filters),
    ]);
    return { items, total };
  }

  // @Http.Put('/enable/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public enableVenture(@Http.Param('id') id: string): Promise<Venture | null> {
  //   return this.venturesService.enableVenture(id);
  // }

  // @Http.Put('/disable/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public disableVenture(
  //   @Http.Param('id') id: string,
  // ): Promise<Venture | null> {
  //   return this.venturesService.disableVenture(id);
  // }

  // @Http.Put('/verify/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public verifyVenture(
  //   @Http.Param('id') id: string,
  // ): Promise<Venture | null> {
  //   return this.venturesService.verifyVenture(id);
  // }

  // @Http.Put('/unverify/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public unverifyVenture(
  //   @Http.Param('id') id: string,
  // ): Promise<Venture | null> {
  //   return this.venturesService.unverifyVenture(id);
  // }

  // @Http.Put('/image/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // @UseInterceptors(FileInterceptor('file'))
  // public updateVentureImage(
  //   @Http.Param('id') ventureId: string,
  //   @Http.UploadedFile() file: Express.Multer.File,
  // ): Promise<void> {
  //   return this.venturesService.updateVentureImage(ventureId, {
  //     mimetype: file.mimetype,
  //     buffer: file.buffer,
  //   });
  // }

  @Http.Delete(':id')
  @Http.HttpCode(Http.HttpStatus.NO_CONTENT)
  public deleteVenture(
    @Http.Param('id') ventureId: string,
    @Http.Query('requestedBy') requestedBy: string,
  ): Promise<void> {
    console.log({ ventureId, requestedBy });
    return this.venturesService.deleteVentureById(ventureId, requestedBy);
  }

  // @Http.Get('/:slug')
  // @Http.HttpCode(Http.HttpStatus.OK)
  // public getVentureByEmail(@Http.Param('slug') slug: string): Promise<Venture> {
  //   return this.venturesService.getVentureBySlug(slug);
  // }
  */
}
