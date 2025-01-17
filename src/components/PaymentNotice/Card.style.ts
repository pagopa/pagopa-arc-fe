import { Theme } from '@mui/material/styles';

export const getStyles = (theme: Theme) => ({
  paper: {
    borderRadius: theme.spacing(1)
  },
  stackContainer: {
    cursor: 'pointer',
    padding: theme.spacing(3),
    gap: theme.spacing(3),
    direction: { sm: 'column', md: 'row' } as const,
    justifyContent: 'space-between'
  },
  headerStack: {
    direction: 'row' as const,
    alignItems: 'center',
    gap: theme.spacing(2)
  },
  headerTypography: {
    maxWidth: { xs: '100%', lg: 460, xl: 600 }
  },
  divider: {
    display: 'flex',
    flex: 1
  },
  detailStack: {
    direction: 'row' as const,
    gap: theme.spacing(2),
    alignItems: 'center',
    width: { xs: '100%', md: 'auto' },
    justifyContent: 'space-between'
  },
  asideStack: {
    width: { xs: '100%', md: '12rem' },
    gap: { xs: theme.spacing(1), sm: theme.spacing(5), md: theme.spacing(1) },
    direction: { xs: 'column', sm: 'row', md: 'column' } as const
  },
  iconButton: {}
});
