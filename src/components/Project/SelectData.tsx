'use client';

import { useProjectStore } from '@/hooks/store/useProjectStore';
import { useUserStore } from '@/hooks/store/useUserStore';
import { trpc } from '@/server/trpc';
import { Box, LinearProgress } from '@mui/material';
import AutoCompleteSelect from '../AutoCompleteSelect';
import ObjectTable from '../ObjectTable';

export default function SelectData() {
  const mid = useUserStore((state) => state.mid);
  const selectedDataOID = useProjectStore((state) => state.selectedDataOID);
  const setDataOID = useProjectStore((state) => state.setDataOID);
  const clear = useProjectStore((state) => state.clear);
  const allData = trpc.dataObject.getAllDataObject.useQuery(mid);
  const userDataTable = trpc.dataObject.getDataTable.useQuery(selectedDataOID);

  const handleSelectChange = (value: string) => {
    if (allData.isSuccess) {
      clear();
      setDataOID(Number(value.split('.')[0]));
    }
  };

  return (
    <Box
      sx={{
        overflowY: 'auto',
        padding: 2,
        width: '100%',
      }}
    >
      <AutoCompleteSelect
        options={allData.data?.map((d, i) => d.OID.toString() + '. ' + d.CName) ?? []}
        initialValueIndex={allData.data?.findIndex((d) => d.OID == selectedDataOID) ?? 0}
        onChange={handleSelectChange}
        loading={allData.isLoading}
      ></AutoCompleteSelect>
      {selectedDataOID !== -1 && userDataTable.isLoading && (
        <LinearProgress color="info" sx={{ top: 10 }} />
      )}
      {userDataTable.data && userDataTable.data.length > 0 && (
        <ObjectTable data={userDataTable.data} />
      )}
    </Box>
  );
}
