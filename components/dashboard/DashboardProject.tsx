import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material';
import { tokens } from 'components/theme';
import AddIcon from '@mui/icons-material/Add';
import AddChartIcon from '@mui/icons-material/Addchart';
import LaunchIcon from '@mui/icons-material/Launch';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import { useRouter } from 'next/router';

function ViewToggleButtons() {
  const [view, setView] = useState('list');

  const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
    setView(nextView);
  };

  return (
    <ToggleButtonGroup orientation={'horizontal'} value={view} exclusive onChange={handleChange}>
      <Tooltip title={'Show as grid'}>
        <ToggleButton value="grid" aria-label="grid" size={'small'}>
          <ViewModuleIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title={'Show as list'}>
        <ToggleButton value="list" aria-label="list" size={'small'}>
          <ViewListIcon />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
}

function ProjectCard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const splitLine = `1px solid ${theme.palette.mode === 'dark' ? '#444444' : '#e6e6e6'}`;
  return (
    <Card
      sx={{
        width: 200,
        height: 200,
        border: `${splitLine}`,
        borderRadius: 2,
      }}
    >
      <CardActionArea sx={{ height: '100%' }}>
        <CardContent
          sx={{
            height: '70%',
            backgroundColor: theme.palette.mode === 'light' ? colors.grey[900] : 'currentcolor',
          }}
        ></CardContent>
        <CardContent
          sx={{
            height: '30%',
            backgroundColor: theme.palette.mode === 'light' ? '#fcfcfc' : colors.primary[500],
          }}
        ></CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function DashboardProject() {
  const router = useRouter();
  const theme = useTheme();
  const splitLine = `1px solid ${theme.palette.mode === 'dark' ? '#444444' : '#e6e6e6'}`;
  const rows = [1, 2, 3, 4];
  const cols = [1, 2, 3, 4];

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alingItem: 'center',
              height: 80,
              width: '100%',
              borderBottom: splitLine,
            }}
          >
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
              <Button
                sx={{ textTransform: 'none', height: 40 }}
                variant={'outlined'}
                color={'secondary'}
                startIcon={<AddChartIcon></AddChartIcon>}
                endIcon={<AddIcon></AddIcon>}
                onClick={() => {
                  const design_project_href = '/design-project/';
                  router.push(design_project_href);
                }}
              >
                New project file
              </Button>
            </Box>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                marginLeft: 5,
              }}
            >
              <Button
                sx={{ textTransform: 'none', height: 40 }}
                variant={'outlined'}
                color={'secondary'}
                startIcon={<LaunchIcon></LaunchIcon>}
                endIcon={<AddIcon></AddIcon>}
              >
                Import project file
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={11}></Grid>
        <Grid item xs={1}>
          <ViewToggleButtons></ViewToggleButtons>
        </Grid>
      </Grid>

      <Container>
        <Grid container spacing={2} marginTop={2} marginBottom={2}>
          {rows.map((row, i) => {
            return cols.map((col, i) => {
              return (
                <Grid key={row + col + i} item xs={3}>
                  <ProjectCard key={row + col + i}></ProjectCard>
                </Grid>
              );
            });
          })}
        </Grid>
      </Container>
    </Container>
  );
}
