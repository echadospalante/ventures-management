import { Municipality } from 'echadospalante-domain';

export interface MunicipalitiesRepository {
  findById(id: number): Promise<Municipality | null>;
  findAll(): Promise<Municipality[]>;
}

export const MunicipalitiesRepository = Symbol('MunicipalitiesRepository');
