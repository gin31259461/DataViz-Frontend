'use client';

import { useProjectStore } from '@/hooks/store/useProjectStore';
import { trpc } from '@/server/trpc';
import { objectToXYData } from '@/utils/parsers';
import { BarStacked } from '@D3Chart';
import { Typography } from '@mui/material';
import LoadingWithTitle from '../LoadingWithTitle';
import TabSlider, { TabItem } from '../TabSlider';

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

  const infographic: TabItem[] = [];
  let currentNode: number;

  selectedPath?.path.forEach((node, i) => {
    if (!nodes.data) return;
    else if (i == 0) {
      currentNode = node;
      return;
    }

    const nodeData = nodes.data[node];
    const xyData = objectToXYData(nodeData[0]);

    infographic.push({
      label: node.toString(),
      content: (
        <div key={node}>
          <BarStacked
            data={xyData}
            mapper={{
              getX: (d: any) => d.x,
              keys: ['y'],
            }}
            base={{
              width: 1000,
              height: 300,
              title: target ?? '',
              color: undefined,
            }}
          />
          <Typography variant="h4" sx={{ textAlign: 'center' }}>
            {selectedPath.nodeLabel[currentNode] && selectedPath.nodeLabel[currentNode][1]}
          </Typography>
        </div>
      ),
    });
    currentNode = node;
  });

  return nodes.isLoading ? (
    <LoadingWithTitle title="Generating infographic" />
  ) : (
    <TabSlider tabs={infographic}></TabSlider>
  );
};

export default GenerateInfographic;
