"use client";

import { useProjectStore } from "@/hooks/useProjectStore";
import { trpc } from "@/server/trpc";
import { objectToXYData } from "@/utils/parsers";
import { BarStacked } from "@D3Chart";
import { Typography } from "@mui/material";
import LoadingWithTitle from "../LoadingWithTitle";
import Slider from "../Slider";

const GenerateInfographic = () => {
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const target = useProjectStore((state) => state.target);
  const selectedPath = useProjectStore((state) => state.selectedPath);
  const nodes = trpc.analysis.getSplitDataFromPath.useQuery({
    oid: selectedDataOID,
    target: target,
    decisionTreePath: {
      path: selectedPath?.path,
      nodeLabel: selectedPath?.nodeLabel,
    },
  });

  const infographic: React.ReactNode[] = [];
  let currentNode: number;

  selectedPath?.path.forEach((node, i) => {
    if (!nodes.data) return;
    else if (i == 0) {
      currentNode = node;
      return;
    }

    const nodeData = nodes.data[node];
    const xyData = objectToXYData(nodeData[0]);

    infographic.push(
      <div>
        <BarStacked
          key={node}
          data={xyData}
          mapper={{
            getX: (d: any) => d.x,
            keys: ["y"],
          }}
          base={{
            width: 1000,
            height: 300,
            title: target ?? "",
            color: undefined,
          }}
        />
        <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
          {selectedPath.nodeLabel[currentNode] &&
            selectedPath.nodeLabel[currentNode][1]}
        </Typography>
      </div>,
    );
    currentNode = node;
  });

  return nodes.isLoading ? (
    <LoadingWithTitle title="Generating infographic" />
  ) : (
    <Slider components={infographic}></Slider>
  );
};

export default GenerateInfographic;
