import { Injectable } from '@nestjs/common';

// import { BasicType, ComplexInclude, Pagination, Venture } from 'echadospalante-core';

import {
  BasicType,
  ComplexInclude,
  Pagination,
  Venture,
  VentureCategory,
} from 'echadospalante-core';

import { PrismaConfig } from '../../../../config/prisma/prisma.connection';
import { VentureFilters } from '../../domain/core/venture-filters';
import { VenturesRepository } from '../../domain/gateway/database/ventures.repository';

@Injectable()
export class VenturesRepositoryImpl implements VenturesRepository {
  public constructor(private prismaClient: PrismaConfig) {}

  public findBySlug(
    slug: string,
    include: Partial<ComplexInclude<Venture>>,
  ): Promise<Venture | null> {
    return this.prismaClient.client.venture
      .findUnique({
        where: {
          slug,
        },
        include,
      })
      .then((venture) => venture as Venture | null);
  }

  public existBySlug(slug: string): Promise<boolean> {
    return this.prismaClient.client.venture
      .count({
        where: {
          slug,
        },
      })
      .then((count) => count > 0);
  }

  public findById(
    id: string,
    include: Partial<ComplexInclude<Venture>>,
  ): Promise<Venture | null> {
    return this.prismaClient.client.venture
      .findUnique({
        where: {
          id,
        },
        include,
      })
      .then((venture) => venture as Venture | null);
  }

  public countByCriteria(filter: Partial<BasicType<Venture>>): Promise<number> {
    return this.prismaClient.client.venture.count({
      where: { ...filter },
    });
  }

  public findAllByCriteria(
    filters: VentureFilters,
    include: Partial<ComplexInclude<Venture>>,
    pagination?: Pagination,
  ): Promise<Venture[]> {
    const {
      search,
      categoryId,
      departmentId,
      municipalityId,
      point,
      radius,
      ownerId,
    } = filters;

    return this.prismaClient.client.venture.findMany({
      where: {
        AND: {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { owner: { firstName: { contains: search } } },
            { owner: { lastName: { contains: search } } },
            { owner: { email: { contains: search } } },
          ],
        },
        categories: {
          some: {
            id: categoryId,
          },
        },
      },
    });
  }

  public deleteByEmail(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public save(venture: Venture): Promise<Venture> {
    return this.prismaClient.client.venture.create({
      data: {
        ...venture,
        owner: {
          connect: {
            id: venture.owner.id,
          },
        },
        ventureDetail: {
          create: venture.detail,
        },
      },
    });
  }

  public findAll(
    include: Partial<ComplexInclude<Venture>>,
    pagination?: Pagination,
  ): Promise<Venture[]> {
    throw new Error('Method not implemented.');
  }

  public lockVenture(id: string): Promise<Venture | null> {
    throw new Error('Method not implemented.');
  }

  public unlockVenture(id: string): Promise<Venture | null> {
    throw new Error('Method not implemented.');
  }

  public verifyVenture(id: string): Promise<Venture | null> {
    throw new Error('Method not implemented.');
  }

  public unverifyVenture(id: string): Promise<Venture | null> {
    throw new Error('Method not implemented.');
  }

  public addVentureCategories(
    id: string,
    roles: VentureCategory[],
  ): Promise<Venture | null> {
    throw new Error('Method not implemented.');
  }

  public removeVentureCategories(
    id: string,
    roles: VentureCategory[],
  ): Promise<Venture | null> {
    throw new Error('Method not implemented.');
  }

  // public save(venture: Venture): Promise<Venture> {
  //   return this.prismaClient.client.venture
  //     .create({
  //       data: {
  //         ...venture,
  //         roles: {
  //           connect: venture.roles.map((role) => ({ id: role.id })),
  //         },
  //         notifications: {
  //           connect: venture.notifications.map((notification) => ({
  //             id: notification.id,
  //           })),
  //         },
  //         comments: {
  //           connect: venture.comments.map((comment) => ({
  //             id: comment.id,
  //           })),
  //         },
  //         ventures: {
  //           connect: venture.ventures.map((venture) => ({
  //             id: venture.id,
  //           })),
  //         },
  //         preferences: {
  //           connect: venture.preferences.map((preference) => ({
  //             id: preference.id,
  //           })),
  //         },
  //         detail: undefined,
  //       },
  //     })
  //     .then(() => venture as Venture);
  // }

  // public findByEmail(
  //   email: string,
  //   include: ComplexInclude<Venture>,
  // ): Promise<Venture | null> {
  //   return this.prismaClient.client.venture
  //     .findFirst({
  //       where: {
  //         email,
  //       },
  //       include,
  //     })
  //     .then((venture) => venture as Venture | null);
  // }

  // public async countByCriteria(
  //   filter: Partial<BasicType<Venture>>,
  // ): Promise<number> {
  //   return this.prismaClient.client.venture.count({
  //     where: { ...filter },
  //   });
  // }

  // public findAllByCriteria(
  //   filters: VentureFilters,
  //   include: ComplexInclude<Venture>,
  //   pagination?: Pagination,
  // ): Promise<Venture[]> {
  //   const { gender, role, search } = filters;
  //   console.log({ filters });
  //   return this.prismaClient.client.venture
  //     .findMany({
  //       where: {
  //         AND: {
  //           OR: [
  //             {
  //               email: {
  //                 contains: search,
  //               },
  //             },
  //             {
  //               firstName: {
  //                 contains: search,
  //               },
  //             },
  //             {
  //               lastName: {
  //                 contains: search,
  //               },
  //             },
  //           ],

  //           detail: {
  //             gender,
  //           },
  //           roles: {
  //             some: {
  //               name: role,
  //             },
  //           },
  //         },
  //       },
  //       include,
  //       skip: pagination?.skip,
  //       take: pagination?.take,
  //     })
  //     .then((ventures) => ventures as unknown as Venture[]);
  // }

  // public deleteByEmail(email: string): Promise<void> {
  //   return this.prismaClient.client.venture
  //     .delete({
  //       where: { email },
  //     })
  //     .then(() => {
  //       console.log('Venture deleted');
  //     });
  // }

  // public findById(
  //   id: string,
  //   include: ComplexInclude<Venture>,
  // ): Promise<Venture | null> {
  //   return this.prismaClient.client.venture
  //     .findUnique({
  //       where: {
  //         id,
  //       },
  //       include,
  //     })
  //     .then((venture) => venture as Venture | null);
  // }

  // public findAll(
  //   include: ComplexInclude<Venture>,
  //   pagination?: Pagination,
  // ): Promise<Venture[]> {
  //   return this.prismaClient.client.venture
  //     .findMany({
  //       include,
  //       skip: pagination?.skip,
  //       take: pagination?.take,
  //     })
  //     .then((ventures) => ventures as unknown as Venture[]);
  // }

  // public lockAccount(email: string): Promise<Venture | null> {
  //   return this.prismaClient.client.venture
  //     .update({
  //       where: {
  //         email,
  //       },
  //       data: {
  //         active: false,
  //       },
  //     })
  //     .then((venture) => {
  //       console.log('Venture locked');
  //       return venture as unknown as Venture;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       return null;
  //     });
  // }

  // public unlockAccount(email: string): Promise<Venture | null> {
  //   return this.prismaClient.client.venture
  //     .update({
  //       where: {
  //         email,
  //       },
  //       data: {
  //         active: true,
  //       },
  //     })
  //     .then((venture) => {
  //       console.log('Venture unlocked');
  //       return venture as unknown as Venture;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       return null;
  //     });
  // }

  // public verifyAccount(email: string): Promise<Venture | null> {
  //   return this.prismaClient.client.venture
  //     .update({
  //       where: {
  //         email,
  //       },
  //       data: {
  //         verified: true,
  //       },
  //     })
  //     .then((venture) => {
  //       console.log('Venture verified');
  //       return venture as unknown as Venture;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       return null;
  //     });
  // }

  // public unverifyAccount(email: string): Promise<Venture | null> {
  //   return this.prismaClient.client.venture
  //     .update({
  //       where: {
  //         email,
  //       },
  //       data: {
  //         verified: false,
  //       },
  //     })
  //     .then((venture) => {
  //       console.log('Venture unverified');
  //       return venture as unknown as Venture;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       return null;
  //     });
  // }

  // public addVentureRoles(email: string, roles: Role[]): Promise<Venture | null> {
  //   return this.prismaClient.client.venture
  //     .update({
  //       where: {
  //         email,
  //       },
  //       data: {
  //         roles: {
  //           connect: roles.map((role) => ({
  //             id: role.id,
  //           })),
  //         },
  //       },
  //     })
  //     .then((venture) => {
  //       console.log('Venture roles updated successfully');
  //       return venture as unknown as Venture;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       return null;
  //     });
  // }

  // public removeVentureRoles(email: string, roles: Role[]): Promise<Venture | null> {
  //   return this.prismaClient.client.venture
  //     .update({
  //       where: {
  //         email,
  //       },
  //       data: {
  //         roles: {
  //           disconnect: roles.map((role) => ({
  //             id: role.id,
  //           })),
  //         },
  //       },
  //     })
  //     .then((venture) => {
  //       console.log('Venture roles updated successfully');
  //       return venture as unknown as Venture;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       return null;
  //     });
  // }

  // public setOnboardingCompleted(email: string): Promise<Venture | null> {
  //   return this.prismaClient.client.venture
  //     .update({
  //       where: {
  //         email,
  //       },
  //       data: {
  //         onboardingCompleted: true,
  //       },
  //     })
  //     .then((venture) => {
  //       console.log('Venture onboarding completed');
  //       return venture as unknown as Venture;
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       return null;
  //     });
  // }

  // public updateDetail(
  //   email: string,
  //   detail: VentureRegisterCreateDto,
  // ): Promise<void> {
  //   return this.prismaClient.client.ventureDetail
  //     .create({
  //       data: {
  //         gender: detail.gender,
  //         birthDate: detail.birthDate,
  //         municipality: {
  //           connect: {
  //             id: detail.municipalityId,
  //           },
  //         },
  //         venture: {
  //           connect: {
  //             email,
  //           },
  //         },
  //       },
  //     })
  //     .then(() => {
  //       console.log('Venture detail updated');
  //     });
  // }

  // public updatePreferences(
  //   email: string,
  //   preferences: string[],
  // ): Promise<void> {
  //   return this.prismaClient.client.venture
  //     .update({
  //       where: {
  //         email,
  //       },
  //       data: {
  //         preferences: {
  //           connect: preferences.map((preference) => ({
  //             id: preference,
  //           })),
  //         },
  //       },
  //     })
  //     .then(() => {
  //       console.log('Venture preferences updated');
  //     });
  // }
}
