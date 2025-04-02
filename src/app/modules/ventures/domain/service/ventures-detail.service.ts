import { Injectable } from '@nestjs/common';

@Injectable()
export class VenturesDetailService {
  public constructor() {
    // Constructor logic here
  }

  public getVentureDetail(id: string) {
    // Logic to get venture detail by id
    return { hola: id };
  }
}
