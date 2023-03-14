import Link from 'next/link';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import style from './style.module.scss';

export default function Card(props: { children: React.ReactNode; title: string; href: string; id?: string }) {
  const theme = useTheme();

  return (
    <Box className={style['card']} border={`1px solid ${theme.palette.mode === 'dark' ? '#444444' : '#e6e6e6'}`}>
      <Link href={props.href}>
        <h3>{props.title}</h3>
        <div id={props.id} className={style['chart_area']}>
          <div className={style['chart']}>{props.children}</div>
        </div>
      </Link>
    </Box>
  );
}
