import { createTRPCRouter } from '@/server/api/trpc';
import { analysisRouter } from './routers/analysis';
import { dataObjectRouter } from './routers/data';

export const appRouter = createTRPCRouter({
  dataObject: dataObjectRouter,
  analysis: analysisRouter,
});

export type AppRouter = typeof appRouter;
