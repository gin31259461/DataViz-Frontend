import AnalysisSetting from "@/components/Project/AnalysisSetting";
import SelectData from "@/components/Project/SelectData";
import SelectPath from "@/components/Project/SelectPath";
import StepperComponent from "@/components/Project/StepperComponent";

export default function ProjectPage() {
  const steps = [
    "Select data",
    "Analysis settings",
    "Select a path",
    "Edit infographic",
    "Last confirm",
    "All done!",
  ];
  const components = [
    <SelectData key={0} />,
    <AnalysisSetting key={1} />,
    <SelectPath key={2} />,
  ];
  return (
    <StepperComponent steps={steps} components={components}></StepperComponent>
  );
}