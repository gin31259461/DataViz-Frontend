import { useTheme } from '@mui/material';

export const GetSplitLineStyle = () => {
  const theme = useTheme();
  return `1px solid ${theme.palette.mode === 'dark' ? '#444444' : '#e6e6e6'}`;
};
