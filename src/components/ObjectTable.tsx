import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useMemo } from "react";
import { useTable } from "react-table";

interface ObjectTableProps {
  data: object[];
}

export default function ObjectTable({ data }: ObjectTableProps) {
  const columns = useMemo(
    () =>
      Object.keys(data[0]).map((key) => ({
        Header: key,
        accessor: (row: { [key: string]: any }) => row[key],
      })),
    [data],
  );

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <TableContainer>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.getHeaderGroupProps().key}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  sx={{ whiteSpace: "nowrap" }}
                  key={column.getHeaderProps().key}
                >
                  {column.render("Header")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow key={row.getRowProps().key}>
                {row.cells.map((cell) => (
                  <TableCell
                    sx={{ whiteSpace: "nowrap" }}
                    key={cell.getCellProps().key}
                  >
                    {cell.render("Cell")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}