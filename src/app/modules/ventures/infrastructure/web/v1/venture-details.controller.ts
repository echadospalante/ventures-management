import * as Http from '@nestjs/common';
import { VenturesDetailService } from '../../../domain/service/ventures-detail.service';

const path = '/ventures';

@Http.Controller(path)
export class VenturesDetailController {
  public constructor(private venturesDetailService: VenturesDetailService) {}

  @Http.Get('/:id/detail')
  public getVentureDetail(@Http.Param('id') id: string) {
    return this.venturesDetailService.getVentureDetail(id);
  }
}
