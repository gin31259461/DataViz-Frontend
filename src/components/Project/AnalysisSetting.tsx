"use client";

import { useProjectStore } from "@/hooks/useProjectStore";
import { analysisResult } from "@/server/api/routers/analysis";
import { trpc } from "@/server/trpc";
import { Box, CircularProgress, Typography } from "@mui/material";
import FieldInfoTable from "./FieldInfoTable";

export default function AnalysisSetting() {
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const tableName = trpc.analysis.getTableName.useQuery(selectedDataOID);
  const columnAnalysis = trpc.analysis.columnAnalysis.useQuery(selectedDataOID);
  const columnDistinctValue =
    trpc.analysis.getColumnDistinctValue.useQuery(selectedDataOID);
  const distinct = columnDistinctValue.data?.value.split(":");
  const fieldInfo = columnAnalysis.isSuccess
    ? (columnAnalysis.data as analysisResult).dimension
        .map((dimension, i) => {
          return {
            id: i,
            type: dimension.DataType,
            fieldName: dimension.ColumnName,
            tableName: tableName.data ? tableName.data.CName || "" : "",
            dimension: true,
            distinctValue: distinct
              ? distinct[
                  distinct?.findIndex(
                    (value) => value == dimension.ColumnName,
                  ) + 1
                ]
              : "",
          };
        })
        .concat(
          (columnAnalysis.data as analysisResult).measure.map((measure, i) => {
            return {
              id: i + (columnAnalysis.data as analysisResult).dimension.length,
              type: measure.DataType,
              fieldName: measure.ColumnName,
              tableName: tableName.data ? tableName.data.CName || "" : "",
              dimension: false,
              distinctValue: "",
            };
          }),
        )
    : [];
  return columnAnalysis.isSuccess ? (
    <FieldInfoTable data={fieldInfo} onTypeChange={() => {}}></FieldInfoTable>
  ) : (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h3">Analyzing columns ...</Typography>
      <CircularProgress color="info" />
    </Box>
  );
}
