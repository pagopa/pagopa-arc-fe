import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentNotice } from './PaymentNotice';
import { DateFormat, datetools } from 'utils/datetools';
import { PaymentNoticeType } from 'models/PaymentNotice';

/**
 * This component is considered private and should not be used directly.
 * Instead, use `PaymentNotice.List` for rendering the list .
 *
 * @component
 * @private
 */

export const _List = ({ paymentNotices }: { paymentNotices: PaymentNoticeType[] }) => {
  const { t } = useTranslation();
  const updatedDate = new Date().toISOString();
  document.body.style.overflow = 'auto';

  return (
    <Stack gap={3}>
      <Stack
        direction={{ sm: 'row', xs: 'column' }}
        gap={1}
        justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        component="header">
        <Typography variant="h6" component="h2" role="label" id="paymentNoticesListLabel">
          {`${t('app.paymentNotices.found', { count: paymentNotices.length })}`}
        </Typography>
        <Typography display="flex" variant="body1" component="div" flexDirection="row" gap="5px">
          <Typography color="text.secondary" component="span">
            {t('app.paymentNotices.updated')}
          </Typography>
          <Typography sx={{ fontWeight: 600 }} component="time" dateTime={updatedDate}>
            {datetools.formatDate(updatedDate, {
              format: DateFormat.LONG,
              withTime: true,
              timeZone: datetools.localTimeZone
            })}
          </Typography>
        </Typography>
      </Stack>
      <Stack
        id="payment-notices-list"
        gap={3}
        component="section"
        role="listbox"
        aria-labelledby="paymentNoticesListLabel"
        aria-live="polite">
        {paymentNotices?.map((paymentNotice) => (
          <PaymentNotice.Card key={paymentNotice.iupd} {...paymentNotice} />
        ))}
      </Stack>
    </Stack>
  );
};
