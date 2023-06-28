'use client';

import { useUserStore } from '@/hooks/store/useUserStore';
import { trpc } from '@/server/trpc';
import { tokens } from '@/utils/theme';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  useTheme,
} from '@mui/material';
import dynamic from 'next/dynamic';
import { Suspense, useCallback, useMemo, useState } from 'react';
import CardButton from '../CardButton';

const ObjectTable = dynamic(() => import('../ObjectTable'));
const ShowDataDialog = dynamic(() => import('./ShowDataDialog'));
const DataFormDialog = dynamic(() => import('./DataFormDialog'));
const MessageSnackbar = dynamic(() => import('../MessageSnackbar'));
const ConfirmDeleteButton = dynamic(() => import('../ConfirmDeleteButton'));

interface DataSchema {
  id: number;
  name: string | null;
  description: string | null;
  since: string | null;
  lastModified: string | null;
  frequency: number;
  md5: {
    type: 'Buffer';
    data: number[];
  };
}

interface ServerProps {
  uploadServer: string;
}

export default function DataPanel(props: ServerProps) {
  /** constants  */
  const mid = useUserStore((state) => state.mid);
  const counts = 10;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /** data state */
  const [selectDataOid, setSelectDataOid] = useState<number | undefined>(undefined);

  /** page state */
  const [page, setPage] = useState(0);

  /** order state */
  const [orderBy, setOrderBy] = useState('id');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');

  /** dialog state */
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewDataDialog, setOpenNewDataDialog] = useState(false);

  /** post state */
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const start = page * counts;
  const dataCounts = trpc.dataObject.getDataObjectCount.useQuery(mid);
  const someDataObject = trpc.dataObject.getSomeDataObject.useQuery({
    order: orderDirection,
    start: start + 1,
    counts: counts,
  });
  const dataTable = trpc.dataObject.getDataTableTop100.useQuery(selectDataOid);
  const lastObjectID = trpc.dataObject.getLastObjectID.useQuery(mid);
  const postData = trpc.dataObject.postData.useMutation();
  const deleteData = trpc.dataObject.deleteData.useMutation();

  /** handlers */
  const handleEdit = (dataSetId: number) => {};

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  };

  const handleDataSetClick = (oid: number) => {
    setSelectDataOid(oid);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSort = useCallback(
    (property: keyof DataSchema) => {
      setOrderDirection((prev) => {
        return property !== orderBy ? prev : prev === 'asc' ? 'desc' : 'asc';
      });
      setOrderBy(property);
    },
    [orderBy],
  );

  const submitForm = async (FormData: FormData) => {
    try {
      await postData.mutateAsync({
        mid: mid,
        name: FormData.get('name')?.toString() ?? '',
        des: FormData.get('des')?.toString() ?? '',
      });

      FormData.delete('name');
      FormData.delete('des');

      if (lastObjectID.data) {
        FormData.append('lastID', (Number(lastObjectID.data) + 1).toString());
      } else FormData.append('lastID', '0');

      await fetch(`${props.uploadServer}/api/uploadCsv`, {
        method: 'POST',
        body: FormData,
      });
      setSubmitSuccess(true);
      setMessage('Upload Successfully');
    } catch (error) {
      setSubmitError(true);
      setMessage('Upload error, please try again later');
      console.log(error);
    }
    someDataObject.refetch();
    dataCounts.refetch();
  };

  const handleDelete = async (dataSetId: number) => {
    await deleteData.mutateAsync({ mid: mid, oid: dataSetId });
    setMessage('Delete Successfully');
    setDeleteSuccess(true);
    setSelectDataOid(undefined);
    someDataObject.refetch();
    dataCounts.refetch();
  };

  const DataTable = useMemo(() => {
    if (dataTable.data) return <ObjectTable data={dataTable.data}></ObjectTable>;
    return <></>;
  }, [dataTable]);

  return (
    <Grid container>
      <Grid container padding={2}>
        <CardButton
          title="New data"
          description="Add new dataset into your space"
          icon={<AddIcon />}
          onClick={() => setOpenNewDataDialog(true)}
        ></CardButton>
        <Grid container marginTop={2} height={2}>
          {someDataObject.isLoading && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress color="info" />
            </Box>
          )}
        </Grid>
      </Grid>

      <Grid container padding={2}>
        <Table>
          <TableHead
            sx={{
              position: 'sticky',
              top: 60,
              zIndex: 5,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <TableRow
              sx={{
                color: colors.greenAccent[500],
              }}
            >
              <TableCell align="left" sx={{ color: 'inherit', width: '10%' }}>
                <div style={{ display: 'flex' }}>
                  ID
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderDirection}
                    onClick={() => handleSort('id')}
                  ></TableSortLabel>
                </div>
              </TableCell>
              <TableCell sx={{ color: 'inherit', width: '50%' }}>
                <div style={{ display: 'flex' }}>
                  Name
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderDirection}
                    onClick={() => handleSort('name')}
                  ></TableSortLabel>
                </div>
              </TableCell>
              <TableCell sx={{ color: 'inherit', width: '20%' }}>
                <div style={{ display: 'flex' }}>
                  Last Updated
                  <TableSortLabel
                    active={orderBy === 'lastModified'}
                    direction={orderDirection}
                    onClick={() => handleSort('lastModified')}
                  ></TableSortLabel>
                </div>
              </TableCell>
              <TableCell align="right" sx={{ color: 'inherit', width: '20%' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {someDataObject.data?.map((dataSet) => (
              <TableRow
                key={dataSet.id}
                sx={{
                  '&:hover': { backgroundColor: theme.palette.action.hover },
                }}
              >
                <TableCell>{dataSet.id}</TableCell>
                <TableCell>{dataSet.name}</TableCell>
                <TableCell>{dataSet.lastModified}</TableCell>
                <TableCell align="right">
                  <Tooltip title={'Edit data'}>
                    <IconButton onClick={() => handleEdit(dataSet.id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <ConfirmDeleteButton
                    onConfirm={handleDelete}
                    deleteID={dataSet.id}
                  ></ConfirmDeleteButton>
                  <Tooltip title={'View data'}>
                    <IconButton onClick={() => handleDataSetClick(dataSet.id)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                onPageChange={handlePageChange}
                rowsPerPageOptions={[]}
                count={dataCounts.data ?? 0}
                rowsPerPage={counts}
                page={page}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Grid>

      <Suspense>
        <ShowDataDialog
          title={someDataObject.data?.find((d) => d.id === selectDataOid)?.name}
          description={someDataObject.data?.find((d) => d.id === selectDataOid)?.description}
          dataInfo={'只顯示前 10 筆資料'}
          open={openDialog}
          onClose={handleCloseDialog}
        >
          {dataTable.isLoading ? <LinearProgress color="info" sx={{ marginTop: 2 }} /> : DataTable}
        </ShowDataDialog>
      </Suspense>

      <DataFormDialog
        open={openNewDataDialog}
        onClose={() => {
          setOpenNewDataDialog(false);
        }}
        onSubmit={submitForm}
      />

      <MessageSnackbar
        open={submitSuccess}
        onClose={() => setSubmitSuccess(false)}
        message={message}
        status="success"
      />
      <MessageSnackbar
        open={submitError}
        onClose={() => setSubmitError(false)}
        message={message}
        status="error"
      />
      <MessageSnackbar
        open={deleteSuccess}
        onClose={() => setDeleteSuccess(false)}
        message={message}
        status="info"
      />
    </Grid>
  );
}
