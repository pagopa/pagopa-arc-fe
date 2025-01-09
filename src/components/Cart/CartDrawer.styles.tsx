import { SxProps, Theme } from '@mui/material';

export const cartDrawerStyles = (theme: Theme): Record<string, SxProps> => ({
  container: {
    zIndex: 10,
    position: 'fixed',
    right: 0,
    top: 0,
    width: { lg: '30%', md: '40%', sm: '50%', xs: '100%' },
    maxWidth: '417px',
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    padding: theme.spacing(3)
  },
  overlay: {
    bgcolor: 'rgba(23, 50, 77, 0.7)',
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%'
  },
  header: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
  },
  cartSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  item: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  items: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    flexGrow: 1,
    overflowY: 'auto'
  },
  emptyCartMessage: {
    gap: theme.spacing(3),
    alignSelf: 'center',
    textAlign: 'center',
    maxWidth: theme.spacing(40)
  },
  actionButton: {}
});
