import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

type analysisTable = {
  TableName: string;
  ColumnName: string;
  DataType: string;
  Kn: number;
  N: number;
  Position: number;
  Ratio: number;
};

export interface analysisResult {
  dimension: analysisTable[];
  measure: analysisTable[];
}

export const analysisRouter = createTRPCRouter({
  columnAnalysis: publicProcedure
    .input(z.number().nullish())
    .query(async ({ input, ctx }) => {
      if (input === undefined) return [];
      await ctx.prisma
        .$queryRaw`EXEC RawDB.dbo.sp_dimension_measure_analysis ${input}`;
      const dimension = `RawDB.dbo.vd_D${input}_Dimension`;
      const measure = `RawDB.dbo.vd_D${input}_Measure`;
      const vd_dimension = await ctx.prisma.$queryRawUnsafe<analysisTable[]>(
        `SELECT * FROM ${dimension}`,
      );
      const vd_measure = await ctx.prisma.$queryRawUnsafe<analysisTable[]>(
        `SELECT * FROM ${measure}`,
      );
      const result: analysisResult = {
        dimension: vd_dimension,
        measure: vd_measure,
      };
      return result;
    }),
  decisionTreeAnalysis: publicProcedure
    .input(
      z.object({
        oid: z.number().optional(),
        target: z.string().optional(),
        features: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!(input.oid && input.target && input.features)) return [];
      const result = await fetch(
        `${process.env.FLASK_SERVER}/api/decisionTree?` +
          `oid=${input.oid}` +
          `&target=${input.target}` +
          `&features=${input.features}`,
      );
      const graph = await result.json();
      return graph;
    }),
  getTableName: publicProcedure
    .input(z.number().optional())
    .query(async ({ input, ctx }) => {
      if (input === undefined) return undefined;
      const tableName = await ctx.prisma.object.findFirst({
        select: { CName: true },
        where: { OID: input },
      });
      return tableName;
    }),
  getColumnDistinctValue: publicProcedure
    .input(z.number().optional())
    .query(async ({ input, ctx }) => {
      if (input === undefined) return undefined;
      const columnDistinctValue = `RawDB.dbo.D${input}_ColDistinctValue`;
      const result = await ctx.prisma.$queryRawUnsafe<{ value: string }[]>(
        `SELECT * FROM ${columnDistinctValue}`,
      );
      return result[0];
    }),
});
