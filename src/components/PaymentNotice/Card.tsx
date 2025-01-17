import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import { PayeeIcon } from 'components/PayeeIcon';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { IconButton, Paper } from '@mui/material';
import { ArcRoutes } from 'routes/routes';
import { useNavigate } from 'react-router-dom';
import { PaymentNoticeEnum, PaymentNoticeType } from 'models/PaymentNotice';
import { getStyles } from './Card.style';

type InfoProps = { label: string; data: string };

const Info = (props: InfoProps) => (
  <Stack>
    <Typography component="div" variant="body2">
      {props.label}
    </Typography>
    <Typography component="div" variant="subtitle1">
      {props.data}
    </Typography>
  </Stack>
);

/**
 * This component is considered private and should not be used directly.
 * Instead, use `PaymentNotice.Card` for rendering the payment notice card.
 *
 * @component
 * @private
 */
export const _Card = (notice: PaymentNoticeType) => {
  const { paymentOptions, paFullName, iupd, type, paTaxCode } = notice;
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = getStyles(theme);
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();

  function viewDetail() {
    navigate(`${ArcRoutes.PAYMENT_NOTICES}${iupd}/${paTaxCode}`);
  }

  return (
    <Paper
      elevation={16}
      id={`payment-notice-${notice.iupd}/${notice.paTaxCode}`}
      sx={styles.paper}>
      <Stack
        data-testid="payment-notices-item"
        role="option"
        component="article"
        onClick={viewDetail}
        {...styles.stackContainer}>
        <Stack {...styles.headerStack} component="header">
          <PayeeIcon src={notice.image.src} alt={paFullName} visible={smUp} />
          <Stack {...styles.headerTypography}>
            <Typography component="h1" variant="subtitle1" noWrap>
              {paFullName}
            </Typography>
            {type === PaymentNoticeEnum.SINGLE && (
              <Typography component="h2">{paymentOptions.description}</Typography>
            )}
          </Stack>
        </Stack>
        <Divider
          orientation={mdUp ? 'vertical' : 'horizontal'}
          flexItem
          variant="fullWidth"
          sx={styles.divider}
        />
        <Stack {...styles.detailStack} component="div">
          {type === PaymentNoticeEnum.SINGLE && (
            <Stack {...styles.asideStack} component="aside">
              <Info label={t('app.paymentNotice.card.amount')} data={paymentOptions.amount} />
              <Info
                label={t('app.paymentNotice.card.expiringDate')}
                data={paymentOptions.dueDate}
              />
            </Stack>
          )}
          <IconButton
            data-testid="payment-notices-item-cta"
            aria-label={t('app.paymentNotice.card.detail')}
            onClick={viewDetail}
            sx={styles.iconButton}>
            <ArrowForwardIosIcon color="primary" fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
};
