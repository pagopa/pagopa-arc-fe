import React from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ErrorIconComponentProps {
  code: string;
}

export const ErrorIconComponent: React.FC<ErrorIconComponentProps> = ({ code }) => {
  switch (code) {
    case '403':
      return <img src="/pictograms/genericerror.svg" title="Error" aria-hidden="true" />;
    case '401':
      return <img src="/pictograms/expired.svg" title="Expired" aria-hidden="true" />;
    case '422':
      return <img src="/pictograms/genericerror.svg" title="Error" aria-hidden="true" />;
    default:
      return <img src="/pictograms/umbrella.svg" title="Something go wrong" aria-hidden="true" />;
  }
};

export const CourtesyPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('errorcode') || 'default';

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={10}>
        <Box my={3}>
          <ErrorIconComponent code={errorMessage} />
        </Box>
        <Typography variant="h4" gutterBottom data-testid="courtesyPage.title">
          {t(`courtesyPage.${errorMessage}.title`, {
            defaultValue: t('courtesyPage.default.title')
          })}
        </Typography>
        <Typography variant="body1" paragraph data-testid="courtesyPage.body">
          {t(`courtesyPage.${errorMessage}.body`, { defaultValue: t('courtesyPage.default.body') })}
        </Typography>
        {errorMessage !== '403' && (
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            color="primary"
            data-testid="courtesyPage.cta">
            {t(`courtesyPage.${errorMessage}.cta`, { defaultValue: t('courtesyPage.default.cta') })}
          </Button>
        )}
      </Box>
    </Container>
  );
};
