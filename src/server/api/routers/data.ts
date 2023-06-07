import { convertBigIntToString } from '@/utils/parsers';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const dataObjectRouter = createTRPCRouter({
  getDataObjectCount: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const count = await ctx.prisma.object.count({
      where: {
        OwnerMID: { equals: input },
        Type: 6,
      },
    });
    console.log(count);
    return count;
  }),
  getSomeDataObject: publicProcedure
    .input(z.object({ order: z.string(), start: z.number(), counts: z.number() }))
    .query(async ({ input, ctx }) => {
      const data = await ctx.prisma.vd_Data.findMany({
        orderBy: {
          id: input.order as 'asc' | 'desc',
        },
        skip: Number(input.start) - 1,
        take: Number(input.counts),
      });
      return data;
    }),
  getDataTable: publicProcedure.input(z.number().optional()).query(async ({ input, ctx }) => {
    if (input === undefined) return [];
    const query = `SELECT TOP 100 * FROM [RawDB].[dbo].[D${input}]`;
    const data = await ctx.prisma.$queryRawUnsafe<Object[]>(query);
    const convertedData = data.map((obj) => convertBigIntToString(obj));
    return convertedData;
  }),
  getAllDataObject: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const result = await ctx.prisma.object.findMany({
      where: {
        OwnerMID: { equals: input },
        Type: 6,
      },
    });
    return result;
  }),
  getLastObjectID: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
    const result = await ctx.prisma.$queryRaw<
      {
        last: number;
      }[]
    >`SELECT IDENT_CURRENT('Object') AS last`;
    return result[0].last;
  }),
  postData: publicProcedure
    .input(z.object({ mid: z.number(), name: z.string(), des: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const query = Prisma.sql`
        DECLARE @lastID NVARCHAR(MAX)

        EXEC dbo.usp_PostData
          @mid = ${input.mid},
          @name = ${input.name},
          @des = ${input.des},
          @lastID = @lastID OUTPUT

        SELECT @lastID as lastID
      `;
      await ctx.prisma.$queryRaw<Object[]>(query);
    }),
  deleteData: publicProcedure
    .input(z.object({ mid: z.number(), oid: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const query = Prisma.sql`
        EXEC dbo.usp_DeleteData
          @mid = ${input.mid},
          @oid = ${input.oid}
      `;
      await ctx.prisma.$queryRaw(query);
    }),
});
