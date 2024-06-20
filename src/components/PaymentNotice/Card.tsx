import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import { PayeeIcon } from 'components/PayeeIcon';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Paper } from '@mui/material';

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

type CardPropsOption = { expiringDate: string } | { multiPayment: boolean };
export type CardProps = {
  payee: {
    name: string;
    srcImg?: string;
    altImg?: string;
  };
  paymentInfo: string;
  amount: string;
} & CardPropsOption;

const isMultiPayment = (option: CardPropsOption): option is { multiPayment: boolean } =>
  'multiPayment' in option && option.multiPayment === true;

const hasDate = (option: CardPropsOption): option is { expiringDate: string } =>
  'expiringDate' in option && !!option.expiringDate;

/**
 * This component is considered private and should not be used directly.
 * Instead, use `PaymentNotice.Card` for rendering the payment notice card.
 *
 * @component
 * @private
 */
export const _Card = ({ payee, amount, paymentInfo, ...rest }: CardProps) => {
  const { t } = useTranslation();
  const smUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  return (
    <Paper elevation={16}>
      <Stack
        component="section"
        borderRadius={1}
        padding={3}
        gap={3}
        direction="row"
        height="152px"
        justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap={2} component="header">
          <PayeeIcon src={payee.srcImg} alt={payee.altImg} visible={smUp} />
          <Stack maxWidth={{ xs: 110, sm: 150, md: 480, lg: 460, xl: 600 }}>
            <Typography component="h2" variant="subtitle1" noWrap>
              {payee.name}
            </Typography>
            <Typography component="p">{paymentInfo}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2} alignItems="center" component="div">
          <Divider orientation="vertical" flexItem variant="fullWidth" />
          <Stack width="12rem" component="aside">
            <Info label={t('app.paymentNotice.card.amount')} data={amount} />
            {isMultiPayment(rest) && (
              <Stack
                borderRadius="4px"
                alignItems="center"
                sx={{ backgroundColor: '#E1F5FE' }}
                component="div">
                <Typography padding="3px" variant="subtitle2" lineHeight="18px">
                  {t('app.paymentNotice.card.multiPayment')}
                </Typography>
              </Stack>
            )}
            {hasDate(rest) && (
              <Info label={t('app.paymentNotice.card.expiring')} data={rest.expiringDate} />
            )}
          </Stack>
          <ArrowForwardIosIcon color="primary" fontSize="small" />
        </Stack>
      </Stack>
    </Paper>
  );
};