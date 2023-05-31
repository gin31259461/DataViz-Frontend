"use client";

import { useProjectStore } from "@/hooks/useProjectStore";

const GenerateInfographic = () => {
  const selectedPath = useProjectStore((state) => state.selectedPath);
  console.log(selectedPath);
  return <div>GenerateInfographic</div>;
};

export default GenerateInfographic;
