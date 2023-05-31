import AnalysisSetting from "@/components/Project/AnalysisSetting";
import GenerateInfographic from "@/components/Project/GenerateInfographic";
import SelectData from "@/components/Project/SelectData";
import SelectPath from "@/components/Project/SelectPath";
import StepperComponent from "@/components/Project/StepperComponent";

export default function ProjectPage() {
  const steps = [
    "Select data",
    "Analysis settings",
    "Select a path",
    "Infographic",
    "Last confirm",
    "All done!",
  ];
  const components = [
    <SelectData key={0} />,
    <AnalysisSetting key={1} />,
    <SelectPath key={2} />,
    <GenerateInfographic key={3} />,
  ];
  return (
    <StepperComponent steps={steps} components={components}></StepperComponent>
  );
}
