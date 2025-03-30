import * as Http from '@nestjs/common';

const path = '/ventures';

@Http.Controller(path)
export class VenturesDetailController {
  @Http.Get('/:id/detail')
  public getVentureDetail(@Http.Param('id') id: string) {
    return { id };
  }

  @Http.Post('/:id/detail')
  public addVentureDetail(
    @Http.Param('id') id: string,
    @Http.Headers('X-Requested-By') requestedBy: string,
  ) {
    return { id };
  }
}
