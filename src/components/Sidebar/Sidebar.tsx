import React, { useEffect } from 'react';
import { ArcRoutes } from 'routes/routes';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  Typography,
  useTheme,
  Tooltip,
  useMediaQuery,
  type Theme
} from '@mui/material';
import { ISidebarMenuItem } from 'models/SidebarMenuItem';
import { SidebarMenuItem } from './SidebarMenuItem';
import { useTranslation } from 'react-i18next';
import { Payments } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import useCollapseMenu from 'hooks/useCollapseMenu';
import { sidebarStyles } from './sidebar.styles';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const lg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const { collapsed, changeMenuState, setCollapsed, setOverlay, overlay } = useCollapseMenu(!lg);

  useEffect(() => {
    setOverlay(!(lg || collapsed));
  }, [lg, collapsed]);
  //This useEffect is needed, otherwise React will complain about the component being re rendered while another re render is in the queue.

  const styles = sidebarStyles(theme, collapsed);

  const menuItems: Array<ISidebarMenuItem> = [
    {
      label: t('menu.homepage'),
      icon: ViewSidebarIcon,
      route: ArcRoutes.DASHBOARD,
      end: true
    },
    {
      label: t('menu.paymentNotices'),
      icon: Payments,
      route: ArcRoutes.PAYMENT_NOTICES
    },
    {
      label: t('menu.receipts.menuTitle'),
      icon: () => <ReceiptLongIcon sx={{ marginLeft: '-1px' }} />,
      route: ArcRoutes.TRANSACTIONS
    }
  ];

  return (
    <>
      <Box sx={styles.container} component="aside">
        <Grid
          alignItems="normal"
          display="flex"
          flexDirection="column"
          item
          component="nav"
          aria-expanded={!collapsed}
          aria-label={t('menu.navigationMenu')}
          role="navigation"
          sx={styles.nav}>
          {overlay && (
            <Box sx={styles.collapseIcon}>
              <Tooltip
                placement="left"
                title={t(!collapsed ? 'sidebar.collapse' : 'sidebar.expand')}>
                <IconButton
                  data-testid="collapseClose"
                  aria-label={t(!collapsed ? 'sidebar.collapse' : 'sidebar.expand')}
                  onClick={() => changeMenuState()}
                  size="large">
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          <List
            sx={styles.list}
            component="ol"
            aria-hidden={collapsed && !lg}
            aria-label={t('menu.description')}>
            {menuItems.map((item, index) => (
              <SidebarMenuItem
                onClick={() => !lg && setCollapsed(true)}
                collapsed={collapsed}
                item={item}
                key={index}
              />
            ))}
          </List>
          <Box sx={styles.hamburgerBox}>
            <Divider orientation="horizontal" flexItem sx={{ display: lg ? 'block' : 'none' }} />
            <Box sx={styles.hamburgerIcon}>
              <Tooltip
                placement="right"
                title={t(!collapsed ? 'sidebar.collapse' : 'sidebar.expand')}>
                <IconButton
                  sx={{ padding: { xs: 1, lg: 0 } }}
                  data-testid="hamburgerButton"
                  aria-label={t(!collapsed ? 'sidebar.collapse' : 'sidebar.expand')}
                  onClick={() => changeMenuState()}
                  size="large">
                  <MenuIcon />
                  {!lg && (
                    <Typography variant="button" sx={styles.hamburgerTypography}>
                      {t('menu.menu')}
                    </Typography>
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>
      </Box>
      {overlay && <Box sx={styles.overlay} />}
    </>
  );
};
