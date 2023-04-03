import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import FolderSharedRoundedIcon from '@mui/icons-material/FolderSharedRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { Sidebar, Menu, MenuItem, useProSidebar, ProSidebarProvider } from 'react-pro-sidebar';
import { useState, useEffect, ReactNode } from 'react';
import { useTheme, Box } from '@mui/material';
import { tokens } from '@/utils/theme';
import Link from 'next/link';

const ExpandIcon = (props: { expand: boolean }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <ArrowForwardIosRoundedIcon
        style={{
          marginRight: 20,
          transform: `rotate(${props.expand ? 0 : -180}deg)`,
          transition: 'transform 0.1s ease-in-out',
        }}
      ></ArrowForwardIosRoundedIcon>
    </div>
  );
};

const DashboardComponent = (props: { children: ReactNode; mid: number }) => {
  const { collapseSidebar } = useProSidebar();
  const [expand, setExpand] = useState<boolean>(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const splitLine = `1px solid ${theme.palette.mode === 'dark' ? '#444444' : '#e6e6e6'}`;
  useEffect(() => {
    collapseSidebar();
  }, [collapseSidebar]);

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: '400px' }}>
      <Sidebar
        transitionDuration={500}
        collapsedWidth={'80px'}
        width={'170px'}
        backgroundColor={theme.palette.mode === 'dark' ? colors.primary[600] : '#fcfcfc'}
        style={{
          borderRight: `${splitLine}`,
        }}
      >
        <Menu
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              // only apply styles on first level elements of the tree
              if (level === 0)
                return {
                  //color: disabled ? '#f5d9ff' : "black",
                  backgroundColor: active
                    ? theme.palette.mode === 'light'
                      ? `${colors.greenAccent[700]}`
                      : `${colors.primary[400]}`
                    : undefined,
                  ':hover': {
                    backgroundColor: colors.greenAccent[500],
                  },
                };
            },
          }}
        >
          <MenuItem
            className={'sidebar-menuitem'}
            onClick={() => {
              collapseSidebar();
              setExpand((b) => !b);
            }}
            icon={<ExpandIcon expand={expand}></ExpandIcon>}
          ></MenuItem>
          <MenuItem
            className={'sidebar-menuitem'}
            icon={<AccountCircleRoundedIcon style={{ marginRight: 20 }}></AccountCircleRoundedIcon>}
            component={<Link href={`/dashboard/profile/`}></Link>}
          >
            我的檔案
          </MenuItem>

          <MenuItem
            className={'sidebar-menuitem'}
            icon={<StorageRoundedIcon style={{ marginRight: 20 }}></StorageRoundedIcon>}
            component={<Link href={`/dashboard/data/`}></Link>}
          >
            我的資料
          </MenuItem>

          <MenuItem
            className={'sidebar-menuitem'}
            icon={<FolderRoundedIcon style={{ marginRight: 20 }}></FolderRoundedIcon>}
            component={<Link href={`/dashboard/project/`}></Link>}
          >
            我的專案
          </MenuItem>

          <MenuItem
            className={'sidebar-menuitem'}
            icon={<FolderSharedRoundedIcon style={{ marginRight: 20 }}></FolderSharedRoundedIcon>}
            component={<Link href={`/dashboard/share/`}></Link>}
          >
            分享
          </MenuItem>
        </Menu>
      </Sidebar>
      <main style={{ overflow: 'auto', width: '100%' }}>
        <Box width={'100%'}>{props.children}</Box>
      </main>
    </div>
  );
};

export default function Dashboard(props: { children: ReactNode }) {
  const mid = 3;
  return (
    <Box sx={{ height: 'calc(100vh - 80px)' }}>
      <ProSidebarProvider>
        <DashboardComponent mid={mid}>{props.children}</DashboardComponent>
      </ProSidebarProvider>
    </Box>
  );
}
