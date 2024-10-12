import { Injectable } from '@nestjs/common';

import { ComplexInclude, VentureCategory } from 'echadospalante-core';

import { PrismaConfig } from '../../../../config/prisma/prisma.connection';
import { VentureCategoriesRepository } from '../../domain/gateway/database/venture-categories.repository';

@Injectable()
export class VentureCategoriesRepositoryImpl
  implements VentureCategoriesRepository
{
  public constructor(private prismaClient: PrismaConfig) {}

  public existsBySlug(slug: string): Promise<boolean> {
    return this.prismaClient.client.ventureCategory
      .findFirst({
        where: { slug },
      })
      .then((ventureCategory) => !!ventureCategory);
  }

  public findManyById(
    ids: string[],
    include: Partial<ComplexInclude<VentureCategory>>,
  ): Promise<VentureCategory[]> {
    return this.prismaClient.client.ventureCategory
      .findMany({
        where: {
          id: {
            in: ids,
          },
        },
        include,
      })
      .then(
        (ventureCategories) =>
          ventureCategories as unknown as VentureCategory[],
      );
  }

  public save(
    category: {
      name: string;
      slug: string;
      description: string;
    },
    include: Partial<ComplexInclude<VentureCategory>>,
  ): Promise<VentureCategory> {
    return this.prismaClient.client.ventureCategory
      .create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
        },
        include,
      })
      .then((ventureCategory) => ventureCategory as unknown as VentureCategory);
  }

  public findManyByName(
    names: string[],
    include: Partial<ComplexInclude<VentureCategory>>,
  ): Promise<VentureCategory[]> {
    return this.prismaClient.client.ventureCategory
      .findMany({
        where: {
          name: {
            in: names,
          },
        },
        include,
      })
      .then(
        (ventureCategories) =>
          ventureCategories as unknown as VentureCategory[],
      );
  }

  public findByName(
    name: string,
    include: Partial<ComplexInclude<VentureCategory>>,
  ): Promise<VentureCategory | null> {
    return this.prismaClient.client.ventureCategory
      .findFirst({
        where: { name },
        include,
      })
      .then((ventureCategory) => ventureCategory as VentureCategory | null);
  }

  public findAll(
    include: Partial<ComplexInclude<VentureCategory>>,
  ): Promise<VentureCategory[]> {
    return this.prismaClient.client.ventureCategory
      .findMany({ include })
      .then(
        (ventureCategories) =>
          ventureCategories as unknown as VentureCategory[],
      );
  }

  // public findByName(
  //   ventureCategory: AppVentureCategory,
  // ): Promise<VentureCategory | null> {
  //   return this.prismaClient.client.ventureCategory
  //     .findFirst({
  //       where: { name: ventureCategory },
  //     })
  //     .then((ventureCategory) => ventureCategory as VentureCategory | null);
  // }

  // public findAll(
  //   include: ComplexType<VentureCategory>,
  // ): Promise<VentureCategory[]> {
  //   return this.prismaClient.client.ventureCategory
  //     .findMany({ include })
  //     .then((ventureCategories) => ventureCategories as VentureCategory[]);
  // }

  // public findManyByName(
  //   ventureCategories: AppVentureCategory[],
  // ): Promise<VentureCategory[]> {
  //   return this.prismaClient.client.ventureCategory
  //     .findMany({
  //       where: {
  //         name: {
  //           in: ventureCategories,
  //         },
  //       },
  //     })
  //     .then((ventureCategories) => ventureCategories as VentureCategory[]);
  // }
}
