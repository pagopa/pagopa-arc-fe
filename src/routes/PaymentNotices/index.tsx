import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PaymentNotice } from 'components/PaymentNotice';
import QueryLoader from 'components/QueryLoader';
import { PaymentNoticesListSkeleton } from 'components/Skeleton';
import { useNormalizedNotices } from 'hooks/useNormalizedNotices';
import { useTranslation } from 'react-i18next';
import utils from 'utils';
import { Alert } from 'components/Alerts/Alert';
import { Helmet } from 'react-helmet';

const Notices = () => {
  const { data, isError, refetch } = useNormalizedNotices();

  const { t } = useTranslation();

  const Content = () => {
    if (isError || !data) return <PaymentNotice.Error onRetry={refetch} />;
    if (!data?.paymentNotices?.length) return <PaymentNotice.Empty />;
    return (
      <Stack gap={5} component="section">
        <Alert
          message={t('app.paymentNotices.noticesAlert.info')}
          action={{
            href: utils.config.checkoutHost,
            message: t('app.paymentNotices.noticesAlert.action')
          }}
        />
        <PaymentNotice.List paymentNotices={data.paymentNotices} />
        <PaymentNotice.Info />
      </Stack>
    );
  };

  return (
    <QueryLoader
      queryKey="paymentNotices"
      loaderComponent={<PaymentNoticesListSkeleton />}
      atLeast={5000}>
      <Content />
    </QueryLoader>
  );
};

export const PaymentNotices = () => {
  const { t } = useTranslation();
  const optIn = utils.storage.pullPaymentsOptIn.get();

  return (
    <>
      <Helmet>
        <title>{`${t('pageTitles.paymentnotices')} - ${t('app.title')} `}</title>
      </Helmet>
      <Typography mb={3} variant="h3" component="h1">
        {t('app.paymentNotices.title')}
      </Typography>
      <Stack height="100%" justifyContent={{ lg: 'space-between' }} component="main">
        {optIn.value ? <Notices /> : <PaymentNotice.Preview />}
      </Stack>
    </>
  );
};
