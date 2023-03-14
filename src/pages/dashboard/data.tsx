import dynamic from 'next/dynamic';
const DashboardComponent = dynamic(() => import('components/dashboard/Dashboard'));

export default function MemberProfile() {
  return (
    <DashboardComponent>
      <h1 style={{ paddingLeft: 20 }}>Building ...</h1>
    </DashboardComponent>
  );
}
