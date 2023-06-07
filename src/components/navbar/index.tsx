'use client';

import { useSplitLineStyle } from '@/hooks/useStyles';
import style from '@/styles/navbar.module.scss';
import styleStore from '@/styles/store.module.scss';
import { ColorModeContext, tokens } from '@/utils/theme';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Button, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { useContext, useState } from 'react';
import CustomAvatar from '../Avatar';
import DataVizIcon from '../DataVizIcon';
import AccountMenu from './AccountMenu';
import Menu from './Menu';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const avatarMenuOpen = Boolean(anchorEl);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const itemList1 = ['管理面板', '新專案', '用戶設置', '反饋', '登入/註冊', 'API 服務'];
  const itemList2 = ['管理面板', '新專案'];
  const itemLink1 = ['/mgt/data', '/project', '/', '/', '/', '/'];
  const itemLink2 = ['/mgt/data', '/project'];
  const [itemSelect, setItemSelect] = useState('');

  const handleClose = () => {
    setMenuOpen(false);
    setItemSelect('');
  };

  const AvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const AvatarMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className={style['container']}>
      <div
        className={style['navbar-container']}
        style={{
          backgroundColor:
            theme.palette.mode === 'dark' ? 'rgb(20, 27, 45, 0.7)' : 'rgb(252, 252, 252, 0.8)',
          borderBottom: `${useSplitLineStyle()}`,
        }}
      >
        <div className={style['icon']}>
          <Link onClick={handleClose} href={'/'} className={style['link']} title={''}>
            <DataVizIcon color={colors.greenAccent[500]}></DataVizIcon>
          </Link>
        </div>

        <h2 className={style['title']}>
          <Link onClick={handleClose} href={'/'} className={style['link']} title={''}>
            Data Viz
          </Link>
        </h2>

        <div className={style['navMenu']}>
          {itemList2.map((item, i) => {
            return (
              <Link
                className={styleStore['link']}
                key={i}
                href={itemLink2[i]}
                style={{
                  marginLeft: 20,
                  fontSize: 14,
                  textShadow: '0 0 .5px',
                  transition: 'color .15s ease',
                  color:
                    itemSelect === item ? theme.palette.info.main : theme.palette.text.secondary,
                }}
                onClick={() => setItemSelect(item)}
              >
                {item}
              </Link>
            );
          })}
          <div className={style['navMenuSecond']}>
            <Button sx={{ border: useSplitLineStyle(), textTransform: 'none' }} color="primary">
              Feedback
            </Button>
            <Button
              sx={{
                border: useSplitLineStyle(),
                textTransform: 'none',
                marginLeft: 1,
              }}
              color="primary"
            >
              Login
            </Button>
            <Button
              variant="contained"
              sx={{ textTransform: 'none', marginLeft: 1 }}
              color="primary"
            >
              Sign up
            </Button>
          </div>
        </div>

        <div className={style['toolbar']}>
          <IconButton onClick={() => colorMode.toggleColorMode()}>
            {theme.palette.mode === 'dark' ? (
              <DarkModeOutlinedIcon fontSize={'medium'}></DarkModeOutlinedIcon>
            ) : (
              <LightModeOutlinedIcon fontSize={'medium'}></LightModeOutlinedIcon>
            )}
          </IconButton>
          <IconButton className={style['navMenuButton']} onClick={handleMenuOpen}>
            {menuOpen ? (
              <CloseOutlinedIcon fontSize={'medium'}></CloseOutlinedIcon>
            ) : (
              <MenuOutlinedIcon fontSize={'medium'}></MenuOutlinedIcon>
            )}
          </IconButton>
          <IconButton
            sx={{
              width: 36,
              height: 36,
            }}
            onClick={AvatarClick}
          >
            <CustomAvatar initials="Abner"></CustomAvatar>
          </IconButton>
          <AccountMenu
            anchorEl={anchorEl}
            open={avatarMenuOpen}
            handleClose={AvatarMenuClose}
            avatar={<CustomAvatar initials="Abner" />}
          ></AccountMenu>
        </div>
      </div>

      <Menu
        items={itemList1}
        itemLinks={itemLink1}
        className={menuOpen ? style['navMenuOpen'] : style['navMenuClose']}
        onClose={handleClose}
      ></Menu>

      {menuOpen && (
        <div
          className={style['backdrop']}
          onClick={() => {
            setMenuOpen(false);
          }}
        ></div>
      )}
    </div>
  );
}
