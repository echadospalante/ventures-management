import { Pagination, Venture, VentureStats } from 'echadospalante-domain';

import { VentureFilters } from '../../core/venture-filters';

export interface VenturesRepository {
  countByUserEmail(email: string): Promise<number>;
  getVenturesStats(ventureId: string): Promise<VentureStats>;
  findRandomVenture(): Promise<Venture | null>;
  isVentureOwner(ventureId: string, requesterEmail: string): Promise<boolean>;
  isVentureOwnerByEmail(ventureId: string, email: string): Promise<boolean>;
  findById(ventureId: string): Promise<Venture | null>;
  deleteById(ventureId: string): Promise<void>;

  findBySlug(slug: string): Promise<Venture | null>;
  // findById(
  //   id: string,
  //
  // ): Promise<Venture | null>;
  findAllByCriteria(
    filters: VentureFilters,
    pagination?: Pagination,
  ): Promise<{ items: Venture[]; total: number }>;
  // deleteByEmail(id: string): Promise<void>;
  save(venture: Venture): Promise<Venture>;
  // findAll(
  //
  //   pagination?: Pagination,
  // ): Promise<Venture[]>;
  // lockVenture(id: string): Promise<Venture | null>;
  // unlockVenture(id: string): Promise<Venture | null>;
  // verifyVenture(id: string): Promise<Venture | null>;
  // unverifyVenture(id: string): Promise<Venture | null>;
  existsBySlug(slug: string): Promise<boolean>;
  // addVentureCategories(
  //   id: string,
  //   roles: VentureCategory[],
  // ): Promise<Venture | null>;
  // removeVentureCategories(
  //   id: string,
  //   roles: VentureCategory[],
  // ): Promise<Venture | null>;
}

export const VenturesRepository = Symbol('VenturesRepository');
