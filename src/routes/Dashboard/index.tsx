import React from 'react';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import utils from 'utils';
import { ArcRoutes } from '../routes';
import { grey } from '@mui/material/colors';
import QueryLoader from 'components/QueryLoader';
import { PaymentNotice } from 'components/PaymentNotice';
import { TransactionListSkeleton } from 'components/Skeleton';
import PaymentButton from 'components/PaymentButton';
import { Empty, Retry, TransactionsList } from 'components/Transactions';
import { useUserInfo } from 'hooks/useUserInfo';
import { Helmet } from 'react-helmet';

const Dashboard = () => {
  const { t } = useTranslation();
  const { data, isError, refetch } = utils.loaders.getNoticesList(
    {
      size: 5,
      ordering: 'DESC'
    },
    ''
  );
  const theme = useTheme();
  const { userInfo } = useUserInfo();

  const rows =
    data &&
    utils.converters.prepareRowsData({
      notices: data.notices,
      status: { label: t('app.transactions.paid') },
      payee: { multi: t('app.transactions.multiEntities') }
    });

  const Content = () => {
    if (isError || !rows) return <Retry action={refetch} />;
    if (rows.length === 0) return <Empty />;
    return <TransactionsList rows={rows} hideDateOrdering />;
  };

  return (
    <>
      <Helmet>
        <title>{`${t('pageTitles.dashboard')} - ${t('app.title')} `}</title>
      </Helmet>
      <Stack
        flex={1}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent={'space-between'}
        alignItems={{ sm: 'center' }}
        gap={3}
        mb={5}>
        <Typography variant="h3" aria-label={t('app.dashboard.greeting')}>
          {userInfo?.name &&
            t('app.dashboard.title', {
              username: utils.converters.capitalizeFirstLetter(userInfo.name)
            })}
        </Typography>
        <PaymentButton />
      </Stack>
      <Stack gap={5}>
        <PaymentNotice.Preview />
        <Stack
          direction={{ sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ sm: 'center' }}
          mb={{ xs: 2, sm: 3 }}
          spacing={{ xs: 1 }}>
          <Typography variant="h6" component="h2" marginInlineStart={{ xs: 1, sm: 0 }}>
            {t('app.dashboard.lastTransactions')}
          </Typography>
          <Button
            component={Link}
            to={ArcRoutes.TRANSACTIONS}
            sx={{
              width: theme.spacing(10),
              justifyContent: 'flex-start',
              p: 0,
              pt: { xs: 1 }
            }}>
            {t('app.dashboard.seeAllTransactions')}
          </Button>
        </Stack>
      </Stack>
      <Box
        bgcolor={grey['A200']}
        padding={{ xs: 3, md: 2 }}
        margin={{ xs: -3, md: 0 }}
        marginTop={{ xs: 0, sm: 1 }}>
        <QueryLoader queryKey="noticesList" loaderComponent={<TransactionListSkeleton />}>
          <Content />
        </QueryLoader>
      </Box>
    </>
  );
};

export default Dashboard;
