"use client";

import { useProjectStore } from "@/hooks/useProjectStore";
import { trpc } from "@/server/trpc";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function SelectPath() {
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const target = useProjectStore((state) => state.target);
  const features = useProjectStore((state) => state.features);
  const graph = trpc.analysis.decisionTreeAnalysis.useQuery({
    oid: selectedDataOID,
    target: target,
    features: features,
  });

  console.log(graph.data);

  return graph.isLoading ? (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h3">Analyzing data ...</Typography>
      <CircularProgress color="info" />
    </Box>
  ) : (
    <div></div>
  );
}
