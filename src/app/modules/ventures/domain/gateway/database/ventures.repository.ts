import { ComplexInclude, Pagination, Venture } from 'echadospalante-core';

import {
  OwnedVentureFilters,
  VentureFilters,
} from '../../core/venture-filters';

export interface VenturesRepository {
  isVentureOwnerByEmail(ventureId: string, email: string): Promise<boolean>;
  findById(
    ventureId: string,
    include: Partial<ComplexInclude<Venture>>,
  ): Promise<Venture | null>;
  deleteById(ventureId: string): Promise<void>;
  countOwnedVentures(filters: OwnedVentureFilters): Promise<number>;
  findBySlug(
    slug: string,
    include: Partial<ComplexInclude<Venture>>,
  ): Promise<Venture | null>;
  // findById(
  //   id: string,
  //   include: Partial<ComplexInclude<Venture>>,
  // ): Promise<Venture | null>;
  countByCriteria(filter: VentureFilters): Promise<number>;
  findAllByCriteria(
    filters: VentureFilters,
    include: Partial<ComplexInclude<Venture>>,
    pagination?: Pagination,
  ): Promise<Venture[]>;
  findOwnedVentures(
    filters: OwnedVentureFilters,
    include: Partial<ComplexInclude<Venture>>,
    pagination?: Pagination,
  ): Promise<Venture[]>;
  // deleteByEmail(id: string): Promise<void>;
  save(venture: Venture): Promise<Venture>;
  // findAll(
  //   include: Partial<ComplexInclude<Venture>>,
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
