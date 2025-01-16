import React from 'react';
import { ISidebarMenuItem } from 'models/SidebarMenuItem';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { SvgIconComponent } from '@mui/icons-material';
import { alpha } from '@mui/material';

type Props = {
  collapsed: boolean;
  item: ISidebarMenuItem;
  onClick: React.MouseEventHandler<HTMLAnchorElement> | undefined;
};

function renderIcon(Icon: SvgIconComponent | (() => JSX.Element)) {
  return <Icon></Icon>;
}

export const SidebarMenuItem = ({ collapsed, item, onClick }: Props) => {
  const theme = useTheme();

  const MenuItem = (
    <ListItem disablePadding>
      <ListItemButton
        end={item.end || false}
        component={NavLink}
        to={item.route}
        onClick={onClick}
        sx={{
          px: 3,
          '&.hover': {
            backgroundColor: 'none'
          },
          '&.active': {
            fontWeight: 'bold',
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            borderRight: '2px solid',
            borderColor: theme.palette.primary.dark,
            '.MuiTypography-root': {
              fontWeight: 600,
              color: theme.palette.primary.dark
            },
            '.MuiListItemIcon-root': {
              color: theme.palette.primary.dark
            }
          }
        }}>
        {item.icon && <ListItemIcon aria-hidden="true">{renderIcon(item.icon)}</ListItemIcon>}
        {!collapsed && (
          <ListItemText
            id={`menu-item-${item.label.toLowerCase()}`}
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
            primary={item.label}
          />
        )}
      </ListItemButton>
    </ListItem>
  );

  return collapsed ? (
    <Tooltip
      title={item.label}
      placement="right"
      arrow
      slotProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -24]
              }
            }
          ]
        }
      }}>
      {MenuItem}
    </Tooltip>
  ) : (
    MenuItem
  );
};
