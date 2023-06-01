"use client";

import { useProjectStore } from "@/hooks/useProjectStore";
import { trpc } from "@/server/trpc";
import { DecisionTreeGraph, findPaths } from "@/utils/findPath";
import { roundNumberToDecimalPlaces } from "@/utils/math";
import {
  Box,
  CircularProgress,
  Divider,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import SortableTable from "../SortableTable";

export default function SelectPath() {
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const target = useProjectStore((state) => state.target);
  const features = useProjectStore((state) => state.features);
  const tableName = trpc.analysis.getTableName.useQuery(selectedDataOID);
  const graph = trpc.analysis.decisionTreeAnalysis.useQuery<DecisionTreeGraph>({
    oid: selectedDataOID,
    target: target,
    features: features,
  });
  const paths = findPaths(graph.data).sort(
    (a, b) => a.path.length - b.path.length,
  );
  const setPathID = useProjectStore((state) => state.setPathID);
  const setPath = useProjectStore((state) => state.setPath);

  const [ratioChecked, setRatioChecked] = useState<string | undefined>(
    undefined,
  );

  const handleRatioChange = (
    value: string,
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (checked) {
      setRatioChecked(value);
      setPathID(value);
      setPath(paths[Number(value)]);
    }
  };

  const columns = [
    "ID",
    "路徑長度",
    "目標分布 (低)",
    "目標分布 (中間)",
    "目標分布 (高)",
    "選擇路徑",
  ];

  const rows = paths.map((o, i) => {
    return [
      i,
      o.path.length,
      (roundNumberToDecimalPlaces(o.targetValueDistribution.low, 2) * 100)
        .toFixed(0)
        .toString() + "%",
      (roundNumberToDecimalPlaces(o.targetValueDistribution.medium, 2) * 100)
        .toFixed(0)
        .toString() + "%",
      (roundNumberToDecimalPlaces(o.targetValueDistribution.high, 2) * 100)
        .toFixed(0)
        .toString() + "%",

      <FormControlLabel
        key={i}
        control={
          <Radio
            onChange={(event, checked) =>
              handleRatioChange(i.toString(), event, checked)
            }
            checked={ratioChecked == i.toString()}
            color="info"
          />
        }
        label=""
      ></FormControlLabel>,
    ];
  });

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
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          marginBottom: 2,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography>資料表 : {tableName.data?.CName}</Typography>
        <Typography>目標 : {target}</Typography>
        <Typography>特徵 : {features?.join(", ")}</Typography>
      </Box>
      <Divider />
      <SortableTable columns={columns} rows={rows}></SortableTable>
    </Box>
  );
}
