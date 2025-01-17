import { Box, Button, Theme, useMediaQuery } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IllusSharingInfo } from '@pagopa/mui-italia';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import utils from 'utils';
import { ArcRoutes } from 'routes/routes';

/**
 * This component is considered private and should not be used directly.
 * Instead, use `PaymentNotice.Preview` for rendering the payment notice preview.
 *
 * @component
 * @private
 */
export const _Preview = () => {
  const { t } = useTranslation();
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const optIn = utils.storage.pullPaymentsOptIn.get();
  const navigate = useNavigate();

  /**
   * Handles the click event for the component.
   * If the user has opted in, navigates to the payment notices page.
   * Otherwise, opens the opt-in modal.
   */
  const onClick = () => {
    const { value } = optIn;
    const { open, ModalId } = utils.modal;

    if (value) {
      navigate(ArcRoutes.PAYMENT_NOTICES);
    } else {
      open(ModalId.OPTIN);
    }
  };

  return (
    <Stack
      sx={{ backgroundColor: 'background.paper' }}
      justifyContent="space-between"
      direction="row"
      borderRadius={4}
      gap={3}
      padding={3}>
      <Stack spacing={3}>
        <Stack gap={1}>
          <Typography variant="h6">{t('app.paymentNotice.preview.title')}</Typography>
          <Typography>{t('app.paymentNotice.preview.description')}</Typography>
        </Stack>
        <Box display="flex" justifyContent={{ xs: 'stretch', sm: 'flex-start' }}>
          <Button
            size="large"
            variant="contained"
            onClick={onClick}
            id="searchButtonPaymentNotices"
            sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {t('app.paymentNotice.preview.action')}
          </Button>
        </Box>
      </Stack>
      {mdUp && <IllusSharingInfo size={120} />}
    </Stack>
  );
};
