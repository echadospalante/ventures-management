import * as Http from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { VentureCategoriesService } from '../../../domain/service/venture-categories.service';
import VentureCategoriesQueryDto from './model/request/venture-categories-query.dto';
import VentureCreateDto from './model/request/venture-create.dto';

const path = '/ventures/categories';

@Http.Controller(path)
export class VentureCategoriesController {
  private readonly logger = new Logger(VentureCategoriesController.name);

  public constructor(
    private readonly ventureCategoriesService: VentureCategoriesService,
  ) {}

  @Http.Get()
  @Http.HttpCode(Http.HttpStatus.OK)
  public async getVentureCategories(
    @Http.Query() query: VentureCategoriesQueryDto,
  ) {
    const { include, pagination, filters } =
      VentureCategoriesQueryDto.parseQuery(query);

    const [items, total] = await Promise.all([
      this.ventureCategoriesService.getVentureCategories(
        filters,
        include,
        pagination,
      ),
      this.ventureCategoriesService.countVentureCategories(filters),
    ]);
    return { items, total };
  }

  // @Http.Post()
  // @Http.HttpCode(Http.HttpStatus.CREATED)
  // public createVenture(
  //   @Http.UploadedFile() image: Express.Multer.File,
  //   @Http.Body() ventureCreateDto: VentureCreateDto,
  // ): Promise<Venture> {
  //   return this.venturesService.saveVenture(ventureCreateDto, image);
  // }

  // @Http.Put('/enable/:email')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public enableVenture(
  //   @Http.Param('email') email: string,
  // ): Promise<Venture | null> {
  //   return this.venturesService.enableVenture(email);
  // }

  // @Http.Put('/disable/:email')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public disableVenture(
  //   @Http.Param('email') email: string,
  // ): Promise<Venture | null> {
  //   return this.venturesService.disableVenture(email);
  // }

  // @Http.Put('/verify/:email')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public verifyVenture(
  //   @Http.Param('email') email: string,
  // ): Promise<Venture | null> {
  //   return this.venturesService.verifyVenture(email);
  // }

  // @Http.Put('/unverify/:email')
  // @Http.HttpCode(Http.HttpStatus.ACCEPTED)
  // public unverifyVenture(
  //   @Http.Param('email') email: string,
  // ): Promise<Venture | null> {
  //   console.log({ EMAIL: email });
  //   return this.venturesService.unverifyVenture(email);
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
