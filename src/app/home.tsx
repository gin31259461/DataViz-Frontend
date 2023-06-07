'use client';

import Loader from '@/components/Loader';
import TypingText from '@/components/TypingText';
import { useSplitLineStyle } from '@/hooks/useStyles';
import { tokens } from '@/utils/theme';
import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import { lazy, Suspense } from 'react';

const HomeGallery = lazy(() => import('@/components/Gallery'));
const Footer = lazy(() => import('@/components/Footer'));

export default function Home() {
  const theme = useTheme();
  const color = tokens(theme.palette.mode);

  return (
    <Container>
      <Box sx={{ borderBottom: useSplitLineStyle(), paddingBottom: '5vh' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography
              variant="h1"
              sx={{
                color: color.greenAccent[500],
                marginTop: 3,
                paddingTop: '5vh',
                whiteSpace: 'normal',
              }}
            >
              Introducing
            </Typography>
            <Typography
              variant="h1"
              sx={{
                color: color.greenAccent[500],
                marginBottom: 3,
                width: 'max-content',
              }}
            >
              <TypingText></TypingText>
            </Typography>
            <Typography fontSize={20}>
              When users need to create charts, they often have to use complex software and spend a
              lot of time and effort. Now there is a simpler way to create information charts. This
              website allows users to easily upload data, and the system will automatically analyze
              the data and recommend the most suitable chart. Users only need to choose their
              preferred chart, adjust the parameters, and they can easily create beautiful charts.
              Whether it is for business reports, academic research, or personal websites, it can
              meet user's needs. Let's experience this simple yet powerful chart-making tool
              together!
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Typography variant="h1" sx={{ marginTop: 3, marginBottom: 3, textAlign: 'center' }}>
          Chart Library
        </Typography>
        <Suspense fallback={<Loader />}>
          <HomeGallery />
        </Suspense>
      </Box>
      <Footer />
    </Container>
  );
}
