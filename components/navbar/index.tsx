import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';

import { useTheme, IconButton, Typography } from '@mui/material';
import DataVizIcon from '@Components/icons/DataViz';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import { tokens, ColorModeContext } from '@Components/theme';
import { GetSplitLineStyle } from '@Components/theme/GetTheme';
import { userContext } from '@Hooks/fetchUser';
import style from './style.module.scss';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const user = useContext(userContext);
  const router = useRouter();

  const handleClose = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const nav_menu = document.getElementById('_nav_menu');

    if (menuOpen) {
      if (nav_menu !== null) {
        nav_menu.style.transform = `translateY(0)`;
        nav_menu.style.opacity = `1`;
      }
    } else {
      if (nav_menu !== null) {
        nav_menu.style.transform = `translateY(-406px)`;
        nav_menu.style.opacity = `0`;
      }
    }
  }, [menuOpen]);

  return (
    <div className={style['container']}>
      <div
        className={style['navbar-container']}
        style={{
          backgroundColor: theme.palette.mode === 'dark' ? 'rgb(20, 27, 45, 0.7)' : 'rgb(252, 252, 252, 0.8)',
          borderBottom: `${GetSplitLineStyle()}`,
        }}
      >
        <div className={style['icon']}>
          <Link href={'/'} className={style['link']} title={''}>
            <DataVizIcon color={colors.greenAccent[500]}></DataVizIcon>
          </Link>
        </div>

        <h2 className={style['title']}>
          <Link href={'/'} className={style['link']} title={''}>
            Data Viz
          </Link>
        </h2>

        <div className={style['toolbar']}>
          <Typography fontSize={1} style={{ userSelect: 'none' }}>
            已登入
          </Typography>
          <IconButton
            onClick={() => {
              router.push('/dashboard/project');
            }}
          >
            <AccountCircleOutlinedIcon fontSize={'medium'}></AccountCircleOutlinedIcon>
          </IconButton>
          <IconButton onClick={() => colorMode.toggleColorMode()}>
            {theme.palette.mode === 'dark' ? (
              <DarkModeOutlinedIcon fontSize={'medium'}></DarkModeOutlinedIcon>
            ) : (
              <LightModeOutlinedIcon fontSize={'medium'}></LightModeOutlinedIcon>
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              setMenuOpen((prev) => !prev);
            }}
          >
            {menuOpen ? (
              <CloseOutlinedIcon fontSize={'medium'}></CloseOutlinedIcon>
            ) : (
              <MenuOutlinedIcon fontSize={'medium'}></MenuOutlinedIcon>
            )}
          </IconButton>
        </div>
      </div>
      <div
        className={style['menu']}
        id="_nav_menu"
        style={{
          backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : '#fcfcfc',
          borderBottom: `${GetSplitLineStyle()}`,
        }}
      >
        <nav className={style['menu_item']}>
          <ul>
            <li>
              <Link onClick={handleClose} className={style['link']} href={'/'}>
                <h4>圖表庫</h4>
              </Link>
            </li>
            <li>
              <Link onClick={handleClose} className={style['link']} href={'/'}>
                <h4>瀏覽公開圖表</h4>
              </Link>
            </li>
            <li>
              <Link onClick={handleClose} className={style['link']} href={'/dashboard/project'}>
                <h4>管理面板</h4>
              </Link>
            </li>
            <li>
              <Link onClick={handleClose} className={style['link']} href={'/'}>
                <h4>註冊</h4>
              </Link>
            </li>
            <li>
              <Link onClick={handleClose} className={style['link']} href={'/'}>
                <h4>登入</h4>
              </Link>
            </li>
            <li>
              <Link onClick={handleClose} className={style['link']} href={'/'}>
                <h4>API 服務</h4>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {menuOpen ? (
        <div
          className={style['backdrop']}
          onClick={() => {
            setMenuOpen(false);
          }}
        ></div>
      ) : (
        <></>
      )}
    </div>
  );
}
