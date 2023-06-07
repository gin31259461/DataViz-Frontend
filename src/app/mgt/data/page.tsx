import Loader from '@/components/Loader';
import { lazy, Suspense } from 'react';

const DataPanel = lazy(() => import('@/components/DataPanel'));
const Dashboard = lazy(() => import('@/components/Dashboard'));

export default function DataPage() {
  const flaskServer = process.env.FLASK_SERVER ?? 'http://localhost:3090';
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Dashboard>
          <div style={{ width: '100%' }}>
            <Suspense fallback={<Loader />}>
              <DataPanel uploadServer={flaskServer}></DataPanel>
            </Suspense>
          </div>
        </Dashboard>
      </Suspense>
    </div>
  );
}
