import '@/assets/styles/global.css';
import type { AppProps } from 'next/app';
import { CssBaseline, Theme, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from '@/utils/theme';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Loader from '@/components/loader';
import { useUser, userContext } from '@/context/userContext';
import Router from 'next/router';
import Navbar from '@/components/navbar';

export default function App({ Component, pageProps }: AppProps) {
  const [theme, colorMode] = useMode();
  const [controlUser] = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on('routeChangeStart', (url) => {
      setIsLoading(true);
    });

    Router.events.on('routeChangeComplete', (url) => {
      setIsLoading(false);
    });

    Router.events.on('routeChangeError', (url) => {
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <Head>
        <title>DataViz</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="icon" href="/image/favicon.ico" />
      </Head>
      <ColorModeContext.Provider value={colorMode as { toggleColorMode: () => void }}>
        <ThemeProvider theme={theme as Theme}>
          <CssBaseline />
          <userContext.Provider value={controlUser}>
            <Navbar></Navbar>
            <div className="page-content">
              {isLoading && <Loader />}
              <Component {...pageProps}></Component>
            </div>
          </userContext.Provider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}
