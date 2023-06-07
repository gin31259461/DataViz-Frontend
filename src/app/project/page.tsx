import AllCompleted from '@/components/Project/AllCompleted';
import ColumnAnalysis from '@/components/Project/ColumnAnalysis';
import GenerateInfographic from '@/components/Project/GenerateInfographic';
import PathAnalysis from '@/components/Project/PathAnalysis';
import SelectData from '@/components/Project/SelectData';
import StepperComponent from '@/components/Project/StepperComponent';
import Summary from '@/components/Project/Summary';

export default function ProjectPage() {
  const steps = [
    'Select data',
    'Column analysis',
    'Path analysis',
    'Generate infographic',
    'Summary analysis',
    'Completed',
  ];
  const components = [
    <SelectData key={0} />,
    <ColumnAnalysis key={1} />,
    <PathAnalysis key={2} />,
    <GenerateInfographic key={3} />,
    <Summary key={4} />,
    <AllCompleted key={5} />,
  ];
  return <StepperComponent steps={steps} components={components}></StepperComponent>;
}
