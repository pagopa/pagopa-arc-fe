import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { cartDrawerStyles } from './CartDrawer.styles';
import { toEuroOrMissingValue } from 'utils/converters';
import { ButtonNaked } from '@pagopa/mui-italia/dist/components/ButtonNaked';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteItem } from 'store/CartStore';
import { CartItem } from 'models/Cart';

const CartItem = (props: Omit<CartItem, 'nav' | 'paTaxCode'>) => {
  const theme = useTheme();
  const styles = cartDrawerStyles(theme);
  const { t } = useTranslation();
  const { paFullName: title, description, amount, iuv: id } = props;

  return (
    <Stack sx={styles.item}>
      <Stack>
        <Typography variant="body1" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="caption">{description}</Typography>
      </Stack>
      <Stack sx={{ ...styles.item, marginTop: 0, marginBottom: 0 }}>
        <Typography variant="body1" fontWeight={600} mr={2}>
          {toEuroOrMissingValue(amount)}
        </Typography>
        <ButtonNaked
          color="error"
          onClick={() => deleteItem(id)}
          aria-label={t('ui.a11y.removeCartItem')}
          name="removeCartItemButton">
          <DeleteIcon />
        </ButtonNaked>
      </Stack>
    </Stack>
  );
};

export default CartItem;
