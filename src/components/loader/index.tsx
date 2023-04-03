import style from './style.module.scss';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material';

export default function Loader() {
  const theme = useTheme();
  return (
    <div
      className={style['container']}
      style={{
        backgroundColor: theme.palette.mode === 'dark' ? 'rgb(0, 0, 0, 0.3)' : 'rgb(252, 252, 252, 0.3)',
      }}
    >
      <div>
        <CircularProgress color={'info'} size={100}></CircularProgress>
      </div>
    </div>
  );
}
