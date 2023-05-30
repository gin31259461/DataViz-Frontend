"use client";

import "@/styles/global.css";
import { ColorModeContext, useMode } from "@/utils/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

export function Provider({ children }: { children: React.ReactNode }) {
  const { theme, colorMode } = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>{children}</div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
