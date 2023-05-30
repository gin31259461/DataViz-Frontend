import { useProjectStore } from "@/hooks/useProjectStore";
import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import MultiSelect from "../MultiSelect";

interface FieldInfo {
  id: number;
  type: string;
  fieldName: string;
  tableName: string;
  dimension: boolean;
  distinctValue: string;
}

interface FieldInfoTableProps {
  data: FieldInfo[];
  onTypeChange: (id: number, type: string) => void;
}

const FieldInfoTable: React.FC<FieldInfoTableProps> = ({
  data,
  onTypeChange,
}) => {
  const target = useProjectStore((state) => state.target);
  const features = useProjectStore((state) => state.features);
  const setTarget = useProjectStore((state) => state.setTarget);
  const setFeatures = useProjectStore((state) => state.setFeatures);
  const [typeValue, setTypeValue] = useState<string[]>(
    data.map((row) => row.type),
  );
  const [boxChecked, setBoxChecked] = useState<string[] | undefined>(features);
  const [ratioChecked, setRatioChecked] = useState<string | undefined>(target);

  const handleRatioChange = (
    value: string,
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    if (checked) {
      setRatioChecked(value);
      setTarget(value);
    }
  };

  const handleCheckBoxChange = (
    value: string,
    event: SyntheticEvent<Element, Event>,
    checked: boolean,
  ) => {
    if (!checked) {
      const newBoxChecked = boxChecked?.filter(
        (fieldName) => fieldName != value,
      );
      setBoxChecked(newBoxChecked);
      setFeatures(newBoxChecked);
    } else {
      const newBoxChecked = [...(boxChecked ?? []), value];
      setBoxChecked(newBoxChecked);
      setFeatures(newBoxChecked);
    }
  };

  const handleTypeChange = (
    id: number,
    index: number,
    event: SelectChangeEvent<string>,
  ) => {
    const { value } = event.target;
    setTypeValue((prev) => {
      const newTypeValue = [...prev];
      newTypeValue[index] = value;
      return newTypeValue;
    });
    onTypeChange(id, value);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>類型</TableCell>
            <TableCell>欄位名稱</TableCell>
            <TableCell>資料表名稱</TableCell>
            <TableCell>維度/度量</TableCell>
            <TableCell>欄位獨特值</TableCell>
            <TableCell>特徵/目標</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={row.id}>
              <TableCell>
                <Select
                  value={typeValue[i]}
                  onChange={(event) => handleTypeChange(row.id, i, event)}
                >
                  <MenuItem value="bigint">數值</MenuItem>
                  <MenuItem value="varchar">類別</MenuItem>
                </Select>
              </TableCell>
              <TableCell>{row.fieldName}</TableCell>
              <TableCell>{row.tableName}</TableCell>
              <TableCell>{row.dimension ? "維度" : "度量"}</TableCell>
              <TableCell sx={{ maxWidth: 100 }}>
                {row.dimension ? (
                  <MultiSelect
                    options={row.distinctValue.split(",")}
                    onChange={() => {}}
                  ></MultiSelect>
                ) : null}
              </TableCell>
              <TableCell>
                {row.dimension ? (
                  <FormControlLabel
                    onChange={(event, checked) =>
                      handleCheckBoxChange(row.fieldName, event, checked)
                    }
                    control={
                      <Checkbox
                        color="info"
                        checked={boxChecked?.includes(row.fieldName) ?? false}
                      />
                    }
                    label="Feature"
                  ></FormControlLabel>
                ) : (
                  <FormControlLabel
                    control={
                      <Radio
                        onChange={(event, checked) =>
                          handleRatioChange(row.fieldName, event, checked)
                        }
                        checked={ratioChecked == row.fieldName}
                        color="info"
                      />
                    }
                    label="Target"
                  ></FormControlLabel>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FieldInfoTable;
