import React from 'react';
import { Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import utils from 'utils';
import QueryLoader from 'components/QueryLoader';
import { UserInfoSkeleton } from 'components/Skeleton';
import { Helmet } from 'react-helmet';

export default function UserRoute() {
  const { t } = useTranslation();
  const theme = useTheme();

  const { data } = utils.loaders.getUserInfo();

  const UserRowInfo = ({
    label,
    data,
    testid = 'UserRowInfo'
  }: {
    label: string;
    data: string;
    testid: string;
  }) => (
    <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} gap={{ md: 1 }}>
      <Typography
        component="div"
        width={{ sm: '20%', md: '25%' }}
        variant="body2"
        data-testid={`${testid}.label`}>
        {label}
      </Typography>
      <Typography component="div" variant="subtitle2" data-testid={`${testid}.value`}>
        {data}
      </Typography>
    </Stack>
  );

  return (
    <>
      <Helmet>
        <title>{`${t('pageTitles.userpage')} - ${t('app.title')} `}</title>
      </Helmet>
      <Stack direction="column" gap={3}>
        <Stack direction="column" gap={2}>
          <Typography
            variant="h4"
            fontSize={{ md: 32 }}
            component="h1"
            data-testid="app.user.title">
            {t('app.user.title')}
          </Typography>
          <Typography variant="body2" component="h2" data-testid="app.user.subtitle">
            {t('app.user.subtitle')}
          </Typography>
        </Stack>
        <Stack gap={2}>
          <Stack
            bgcolor={theme.palette.background.paper}
            borderRadius={1}
            p={3}
            gap={{ xs: 2, md: 0 }}>
            <QueryLoader queryKey="userInfo" loaderComponent={<UserInfoSkeleton />}>
              <UserRowInfo
                label={t('app.user.info.name')}
                data={utils.converters.capitalizeFirstLetter(data?.name)}
                testid="app.user.info.name"
              />
              <UserRowInfo
                label={t('app.user.info.surname')}
                data={utils.converters.capitalizeFirstLetter(data?.familyName)}
                testid="app.user.info.surname"
              />
              <UserRowInfo
                label={t('app.user.info.identifier')}
                data={data?.fiscalCode || utils.config.missingValue}
                testid="app.user.info.identifier"
              />
              <UserRowInfo
                label={t('app.user.info.email')}
                data={data?.email || utils.config.missingValue}
                testid="app.user.info.email"
              />
            </QueryLoader>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
