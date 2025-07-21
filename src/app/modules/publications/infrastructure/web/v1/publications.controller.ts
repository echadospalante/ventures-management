import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { VenturePublication } from 'echadospalante-domain';

import { PublicationsService } from '../../../domain/service/publications.service';
import PublicationCreateDto from './model/request/publication-create.dto';
import PublicationsQueryDto from './model/request/publications-query.dto';
import { UploadedPhotoResultDto } from './model/response/uploaded-photo-result.dto';
import HighLightedPublicationsQueryDto from './model/request/highlighted-publications-query';

const path = '/ventures';

@Http.Controller(path)
export class VenturePublicationsController {
  private readonly logger = new Logger(VenturePublicationsController.name);

  public constructor(
    private readonly publicationsService: PublicationsService,
  ) {}

  @Http.Post('/_/publications/cover-photo')
  @Http.UseInterceptors(FileInterceptor('file'))
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public createVenturePublicationCoverPhoto(
    @Http.UploadedFile() image: Express.Multer.File,
  ): Promise<UploadedPhotoResultDto> {
    return this.publicationsService.savePublicationCoverPhoto(image);
  }

  // Not exposed in the gateway, only used internally
  @Http.Get('/_/publications/stats/count-by-user/:email')
  public async getVentureStatsCountByUser(@Http.Param('email') email: string) {
    return this.publicationsService.getPublicationsCountByUser(email);
  }

  @Http.Post('/:ventureId/publications')
  @Http.HttpCode(Http.HttpStatus.CREATED)
  public createVenturePublication(
    @Http.Body() body: PublicationCreateDto,
    @Http.Param('ventureId') ventureId: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ): Promise<VenturePublication> {
    const venturePublicationCreate = PublicationCreateDto.toEntity(body);
    return this.publicationsService.savePublication(
      venturePublicationCreate,
      ventureId,
      requestedBy,
    );
  }

  @Http.Get('/_/publications')
  public async getPublicationsFromAllVentures(
    @Http.Query() query: PublicationsQueryDto,
  ) {
    const { pagination, filters } = PublicationsQueryDto.parseQuery(query);
    return this.publicationsService.getPublicationsFromAllVentures(
      filters,
      pagination,
    );
  }

  @Http.Get('/_/publications/highlighted')
  public async getHighlightedPublications(
    @Http.Query('search') search: string,
    @Http.Query('categoriesIds') categoriesIds: string,
    @Http.Query('from') from: string,
    @Http.Query('to') to: string,
  ) {
    const { filters, pagination } =
      HighLightedPublicationsQueryDto.fromQueryParams(
        search,
        categoriesIds,
        from,
        to,
      );
    return this.publicationsService.getHighlightedPublications(
      filters,
      pagination,
    );
  }

  @Http.Get('/_/publications/:publicationId')
  public async getVenturePublicationDetail(
    @Http.Param('publicationId') publicationId: string,
  ) {
    return this.publicationsService.getPublicationDetail(publicationId);
  }

  @Http.Get('/:ventureSlug/publications')
  public async getVenturePublications(
    @Http.Query() query: PublicationsQueryDto,
    @Http.Param('ventureSlug') ventureSlug: string,
  ) {
    const { pagination, filters } = PublicationsQueryDto.parseQuery(query);
    return this.publicationsService.getVenturePublications(
      ventureSlug,
      filters,
      pagination,
    );
  }

  // @Http.Patch('/:id')
  // public async updateVenturePublication(
  //   @Http.Param('id') id: string,
  //   @Http.Body() body: PublicationUpdateDto,
  //   @Http.Headers('X-Requested-By') requestedBy: string,
  // ) {
  //   const venturePublicationUpdate = PublicationUpdateDto.toEntity(body);

  //   return this.publicationsService.updatePublication(id, requestedBy, venturePublicationUpdate);
  // }

  /*

  @Http.Get('/slug/:slug')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getVenturePublicationBySlug(
    @Http.Param('slug') slug: string,
  ): Promise<VenturePublication> {
    console.log({ slug });
    return this.venturePublicationsService.getVenturePublicationBySlug(slug);
  }

  @Http.Get('/owned')
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getOwnedVenturePublications(@Http.Query() query: OwnedVenturePublicationsQueryDto) {
    const { include, filters, pagination } =
      OwnedVenturePublicationsQueryDto.parseQuery(query);
    console.log({ include, filters, pagination });

    const [items, total] = await Promise.all([
      this.venturePublicationsService.getOwnedVenturePublications(filters, include, pagination),
      this.venturePublicationsService.countOwnedVenturePublications(filters),
    ]);
    return { items, total };
  }

  // @Http.Put('/enable/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public enableVenturePublication(@Http.Param('id') id: string): Promise<VenturePublication | null> {
  //   return this.venturePublicationsService.enableVenturePublication(id);
  // }

  // @Http.Put('/disable/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public disableVenturePublication(
  //   @Http.Param('id') id: string,
  // ): Promise<VenturePublication | null> {
  //   return this.venturePublicationsService.disableVenturePublication(id);
  // }

  // @Http.Put('/verify/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public verifyVenturePublication(
  //   @Http.Param('id') id: string,
  // ): Promise<VenturePublication | null> {
  //   return this.venturePublicationsService.verifyVenturePublication(id);
  // }

  // @Http.Put('/unverify/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public unverifyVenturePublication(
  //   @Http.Param('id') id: string,
  // ): Promise<VenturePublication | null> {
  //   return this.venturePublicationsService.unverifyVenturePublication(id);
  // }

  // @Http.Put('/image/:id')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // @UseInterceptors(FileInterceptor('file'))
  // public updateVenturePublicationImage(
  //   @Http.Param('id') venturePublicationId: string,
  //   @Http.UploadedFile() file: Express.Multer.File,
  // ): Promise<void> {
  //   return this.venturePublicationsService.updateVenturePublicationImage(venturePublicationId, {
  //     mimetype: file.mimetype,
  //     buffer: file.buffer,
  //   });
  // }

  @Http.Delete(':id')
  @Http.HttpCode(Http.HttpStatus.NO_CONTENT)
  public deleteVenturePublication(
    @Http.Param('id') venturePublicationId: string,
    @Http.Query('requestedBy') requestedBy: string,
  ): Promise<void> {
    console.log({ venturePublicationId, requestedBy });
    return this.venturePublicationsService.deleteVenturePublicationById(venturePublicationId, requestedBy);
  }

  // @Http.Get('/:slug')
  // @Http.HttpCode(Http.HttpStatus.OK)
  // public getVenturePublicationByEmail(@Http.Param('slug') slug: string): Promise<VenturePublication> {
  //   return this.venturePublicationsService.getVenturePublicationBySlug(slug);
  // }
  */
}
