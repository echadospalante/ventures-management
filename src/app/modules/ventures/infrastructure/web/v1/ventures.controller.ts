import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { VenturesService } from '../../../domain/service/ventures.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Venture } from 'echadospalante-core';
import VentureCreateDto from './model/request/venture-create.dto';
import { UploadedPhotoResultDto } from './model/response/uploaded-photo-result.dto';

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
    return this.venturesService.saveVentureCoverPhoto(image);
  }

  @Http.Post('')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public createVenture(
    @Http.Body() ventureCreateDto: VentureCreateDto,
  ): Promise<Venture> {
    const ventureCreate = VentureCreateDto.toEntity(ventureCreateDto);
    return this.venturesService.saveVenture(
      ventureCreate,
      ventureCreateDto.ownerId,
    );
  }

  /*
  @Http.Get()
  public async getVentures(@Http.Query() query: VenturesQueryDto) {
    const { pagination, filters } = VenturesQueryDto.parseQuery(query);
    console.log(filters);
    const [items, total] = await Promise.all([
      this.venturesService.getVentures(filters, pagination),
      this.venturesService.countVentures(filters),
    ]);
    return { items, total };
  }

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
