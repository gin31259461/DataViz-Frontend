'use client';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import DatasetIcon from '@mui/icons-material/Dataset';
import LogoutIcon from '@mui/icons-material/Logout';
import PieChartIcon from '@mui/icons-material/PieChart';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  const theme = useTheme();
  const [drawerWidth, setDrawerWidth] = useState(180);
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setDrawerWidth(180);
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setDrawerWidth(50);
    }
  }, [open]);

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
        }}
        variant="persistent"
        anchor="left"
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.default,
            width: drawerWidth,
            transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
            height: 'calc(100vh - 80px)',
            top: '80px',
            zIndex: 10,
            position: 'sticky',
            overflow: 'hidden',
          },
        }}
        open
      >
        <Divider />
        <div style={{ padding: 3 }}>
          {open ? (
            <IconButton onClick={handleDrawerClose}>
              <ArrowBackIosNewRoundedIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleDrawerOpen}>
              <ArrowForwardIosRoundedIcon />
            </IconButton>
          )}
        </div>
        <Divider />
        <List>
          <Link href="/mgt/data" style={{ color: 'inherit' }}>
            <ListItemButton>
              <ListItemIcon>
                <DatasetIcon />
              </ListItemIcon>
              <ListItemText primary="Data" />
            </ListItemButton>
          </Link>
          <Link href="/mgt/infographic" style={{ color: 'inherit' }}>
            <ListItemButton>
              <ListItemIcon>
                <PieChartIcon />
              </ListItemIcon>
              <ListItemText primary="Infographic" sx={{ whiteSpace: 'nowrap' }} />
            </ListItemButton>
          </Link>
        </List>
        <Divider />
        <List>
          <ListItemButton>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings"></ListItemText>
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>
      <main style={{ width: '100%' }}>{children}</main>
    </Box>
  );
}
