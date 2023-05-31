import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  useTheme,
} from "@mui/material";
import { useState } from "react";

interface TableSortableProps {
  columns: string[];
  rows: React.ReactNode[][];
}

const SortableTable: React.FC<TableSortableProps> = ({ columns, rows }) => {
  const [orderby, setOrderby] = useState(columns[0]);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const theme = useTheme();

  const handleSort = (currentOrderby: string) => {
    setOrderDirection((prev) => {
      return currentOrderby !== orderby
        ? prev
        : prev === "asc"
        ? "desc"
        : "asc";
    });
    setOrderby(currentOrderby);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: theme.palette.background.default,
            zIndex: 10,
          }}
        >
          <TableRow>
            {columns.map((column, i) => {
              return (
                <TableCell key={i}>
                  <div>
                    {column}
                    <TableSortLabel
                      active={orderby === column}
                      direction={orderDirection}
                      onClick={() => handleSort(column)}
                    ></TableSortLabel>
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            return (
              <TableRow
                key={i}
                sx={{
                  "&:hover": { backgroundColor: theme.palette.action.hover },
                }}
              >
                {row.map((cell, i) => {
                  return <TableCell key={i}>{cell}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SortableTable;
