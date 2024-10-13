import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { Venture } from 'echadospalante-core';

import { VenturesService } from '../../../domain/service/ventures.service';
import VentureCreateDto from './model/request/venture-create.dto';
import VenturesQueryDto from './model/request/ventures-query.dto';

const path = '/ventures';

@Http.Controller(path)
export class VenturesController {
  private readonly logger = new Logger(VenturesController.name);

  public constructor(private readonly venturesService: VenturesService) {}

  @Http.Get()
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getVentures(@Http.Query() query: VenturesQueryDto) {
    const { include, pagination, filters } = VenturesQueryDto.parseQuery(query);
    const [items, total] = await Promise.all([
      this.venturesService.getVentures(filters, include, pagination),
      this.venturesService.countVentures(filters),
    ]);
    return { items, total };
  }

  @Http.Post()
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public createVenture(
    @Http.UploadedFile() image: Express.Multer.File,
    @Http.Body() ventureCreateDto: VentureCreateDto,
  ): Promise<Venture> {
    return this.venturesService.saveVenture(ventureCreateDto, image);
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

  // @Http.Delete(':id')
  // @Http.HttpCode(Http.HttpStatus.NO_CONTENT)
  // public deleteVenture(@Http.Param('email') email: string): Promise<void> {
  //   return this.venturesService.deleteVentureByEmail(email);
  // }

  // @Http.Get('/:slug')
  // @Http.HttpCode(Http.HttpStatus.OK)
  // public getVentureByEmail(@Http.Param('slug') slug: string): Promise<Venture> {
  //   return this.venturesService.getVentureBySlug(slug);
  // }
}
