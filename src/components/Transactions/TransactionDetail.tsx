import { Download } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Snackbar,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { CopyToClipboardButton } from '@pagopa/mui-italia';
import BRAND from './Brand';
import { BRANDS } from '../../models/NoticeDetail';
import paypal from '../../assets/paypal.png';
import { type NoticeDetail as NoticeDetailType } from '../../models/NoticeDetail';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { getReceipt as getReceiptApi } from 'utils/files';

export default function TransactionDetail({ noticeData }: { noticeData: NoticeDetailType }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [toastOpen, setToastOpen] = useState(false);

  const getReceipt = async (transactionId: string) => {
    try {
      await getReceiptApi(transactionId);
    } catch (err) {
      setToastOpen(true);
    }
  };

  const isPaypal = noticeData.paymentMethod === 'PPAL';
  const isCard = noticeData.paymentMethod === 'CP' || noticeData.paymentMethod === 'PO';
  const isUnManaged = !isPaypal && !isCard;
  const hasReceipt = noticeData.origin != 'PM';

  return (
    <Grid container>
      <Stack
        direction={{ md: 'row' }}
        justifyContent="space-between"
        alignItems={{ md: 'center' }}
        width="100%"
        gap={3}>
        <Stack
          direction={{ md: 'row' }}
          gap={3}
          justifyContent={{ md: 'space-between' }}
          width="inherit">
          <Typography variant="h2" fontSize={{ xs: 28, md: 32 }} sx={{ wordBreak: 'break-word' }}>
            {t('app.transactionDetail.title')}
          </Typography>
          {hasReceipt && (
            <Button
              data-testid="receipt-download-btn"
              endIcon={<Download />}
              sx={{ width: { xs: '100%', sm: 'fit-content' } }}
              size="large"
              onClick={() => {
                getReceipt(noticeData.eventId);
              }}
              variant="contained">
              {t('app.transactionDetail.downloadReceipt')}
            </Button>
          )}
        </Stack>
      </Stack>
      {!hasReceipt && (
        <Alert severity="info" variant="outlined" sx={{ mt: 3 }}>
          {t('app.transactionDetail.noReceipt')}
        </Alert>
      )}
      <Stack spacing={2} mt={3} width={'100%'}>
        <Snackbar
          autoHideDuration={6000}
          onClose={() => {
            setToastOpen(false);
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={toastOpen}>
          <Alert severity="error" variant="outlined">
            {t('app.transactionDetail.downloadReceiptError')}
          </Alert>
        </Snackbar>
        <Grid container>
          {/* LEFT COLUMN: PAID NOTICE INFO */}
          <Grid container item xs={12} md={7}>
            <Box
              bgcolor={theme.palette.background.paper}
              borderRadius={1.5}
              pt={4}
              pl={3}
              pr={3}
              height={'fit-content'}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography
                    variant="h4"
                    fontSize={{ xs: 22, md: 24 }}
                    sx={{ wordBreak: 'break-word' }}>
                    {noticeData.subject}
                  </Typography>

                  <Stack spacing={2} pt={3}>
                    <Grid container item>
                      <Grid item md={5} xs={12}>
                        <Typography
                          sx={{ wordBreak: 'break-word' }}
                          color={theme.palette.text.secondary}>
                          {t('app.transactionDetail.amount')}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          sx={{ wordBreak: 'break-word' }}
                          fontWeight={600}
                          id="transaction-detail-partialAmount">
                          {noticeData.partialAmount}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item md={5} xs={12}>
                        <Typography
                          sx={{ wordBreak: 'break-word' }}
                          color={theme.palette.text.secondary}>
                          {t('app.transactionDetail.creditorEntity')}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          sx={{ wordBreak: 'break-word' }}
                          fontWeight={600}
                          id="transaction-detail-creditorEntity">
                          {noticeData.creditorEntity}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item md={5} xs={12}>
                        <Typography
                          mt={2}
                          sx={{ wordBreak: 'break-word' }}
                          color={theme.palette.text.secondary}>
                          {t('app.transactionDetail.debtor')}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Stack
                          direction={{ xs: 'column', sm: 'row', md: 'column' }}
                          spacing={{ xs: 0, sm: 1, md: 0 }}>
                          <Typography
                            sx={{ wordBreak: 'break-word' }}
                            fontWeight={600}
                            id="transaction-detail-debtor">
                            {noticeData.debtor}
                          </Typography>
                          <Typography
                            sx={{ wordBreak: 'break-word' }}
                            fontWeight={600}
                            id="transaction-detail-debtorFiscalCode">
                            ({noticeData.debtorFiscalCode})
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item md={5} xs={12}>
                        <Typography
                          sx={{ wordBreak: 'break-word' }}
                          color={theme.palette.text.secondary}>
                          {t('app.transactionDetail.noticeCode')}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          sx={{ wordBreak: 'break-word' }}
                          fontWeight={600}
                          id="transaction-detail-noticeCode">
                          {noticeData.noticeCode}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container item>
                      <Grid item md={5} xs={12}>
                        <Typography
                          sx={{ wordBreak: 'break-word' }}
                          color={theme.palette.text.secondary}>
                          {t('app.transactionDetail.creditorFiscalCode')}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          sx={{ wordBreak: 'break-word' }}
                          fontWeight={600}
                          id="transaction-detail-creditorFiscalCode">
                          {noticeData.creditorFiscalCode}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                </Grid>

                <Grid item xs={12} pt={3}>
                  <Divider orientation="horizontal" />
                </Grid>
                <Grid item xs={12}>
                  <Stack pt={4.5} pb={4} alignItems={'end'} spacing={2}>
                    <Grid container justifyContent={'space-between'}>
                      <Grid item xs={9}>
                        <Typography
                          sx={{ wordBreak: 'break-word' }}
                          color={theme.palette.text.secondary}>
                          {t('app.transactionDetail.total')}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography
                          id="transaction-detail-total"
                          sx={{ wordBreak: 'break-word' }}
                          fontSize={{ xs: '22', md: '24' }}
                          variant="h6">
                          <b>{noticeData.total}</b>
                        </Typography>
                      </Grid>
                      <Grid item mt={2}>
                        <Typography
                          fontSize={14}
                          sx={{ wordBreak: 'break-word' }}
                          color={theme.palette.text.secondary}>
                          <Trans
                            i18nKey="app.transactionDetail.totalLabel"
                            values={{ fee: noticeData.fee, psp: noticeData.PSP }}
                          />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* RIGTH COLUMN: TRANSACTION INFO */}
          <Grid container flexDirection={'column'} item xs={12} md={5} mt={{ xs: 3, md: 0 }}>
            <Grid item>
              <Box
                bgcolor={theme.palette.background.paper}
                borderRadius={1.5}
                pt={4}
                pl={3}
                pb={4}
                ml={{ md: 3 }}
                pr={3}>
                {/* TITLE */}
                <Stack mb={3}>
                  <Typography fontWeight={700} variant="caption">
                    {t('app.transactionDetail.card2.title').toUpperCase()}
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  {/* PAYER AND METHOD INFO */}
                  {noticeData?.payer && !isUnManaged && (
                    <>
                      <Stack
                        direction={{ xs: 'column', sm: 'row', md: 'column' }}
                        spacing={{ xs: 0, sm: 1, md: 0 }}>
                        <Typography
                          sx={{ wordBreak: 'break-word' }}
                          color={theme.palette.text.secondary}>
                          {t('app.transactionDetail.paidBy')}
                        </Typography>
                        <Typography
                          sx={{ wordBreak: 'break-word' }}
                          fontSize={16}
                          fontWeight={600}
                          lineHeight={1.8}>
                          {noticeData.payer.name}
                        </Typography>
                        {noticeData.payer.taxCode && (
                          <Typography
                            sx={{ wordBreak: 'break-word' }}
                            fontSize={16}
                            fontWeight={600}
                            lineHeight={1.8}>
                            ({noticeData.payer.taxCode})
                          </Typography>
                        )}
                      </Stack>
                      <Divider />

                      {noticeData?.walletInfo && (
                        <>
                          <Grid container>
                            <Grid alignContent={'center'}>
                              {isPaypal && <img alt={'PayPal'} src={paypal} />}
                              {isCard && <BRAND name={noticeData.walletInfo.brand as BRANDS} />}
                            </Grid>
                            <Grid item xs={10}>
                              <Stack pl={2}>
                                <Typography
                                  sx={{ wordBreak: 'break-word' }}
                                  color={theme.palette.text.secondary}>
                                  {t('app.transactionDetail.paymentMethod')}
                                </Typography>
                                <Typography
                                  sx={{ wordBreak: 'break-word' }}
                                  fontSize={16}
                                  fontWeight={600}>
                                  {isPaypal && noticeData.walletInfo.maskedEmail}
                                  {isCard &&
                                    `${noticeData.walletInfo.brand} ${noticeData.walletInfo.blurredNumber}`}
                                </Typography>
                              </Stack>
                            </Grid>
                          </Grid>
                          <Divider />

                          <Stack>
                            <Typography
                              sx={{ wordBreak: 'break-word' }}
                              color={theme.palette.text.secondary}>
                              {t('app.transactionDetail.accountHolder')}
                            </Typography>
                            <Typography
                              sx={{ wordBreak: 'break-word' }}
                              fontSize={16}
                              fontWeight={600}>
                              {noticeData.walletInfo.accountHolder}
                            </Typography>
                          </Stack>
                          <Divider />
                        </>
                      )}
                    </>
                  )}

                  {/* PSP INFO */}
                  <Stack>
                    <Typography
                      sx={{ wordBreak: 'break-word' }}
                      color={theme.palette.text.secondary}>
                      {t('app.transactionDetail.PSP')}
                    </Typography>
                    <Typography
                      sx={{ wordBreak: 'break-word' }}
                      fontWeight={600}
                      id="transaction-detail-psp">
                      {noticeData.PSP}
                    </Typography>
                  </Stack>
                  <Divider />

                  {/* DATE TIME */}
                  <Stack>
                    <Typography
                      sx={{ wordBreak: 'break-word' }}
                      color={theme.palette.text.secondary}>
                      {t('app.transactionDetail.dateAndTime')}
                    </Typography>
                    <Typography sx={{ wordBreak: 'break-word' }} fontSize={16} fontWeight={600}>
                      {noticeData.dateTime}
                    </Typography>
                  </Stack>
                  <Divider />

                  {/* AUTH CODE */}
                  <Grid container>
                    <Grid item xs={10}>
                      <Typography
                        sx={{ wordBreak: 'break-word' }}
                        color={theme.palette.text.secondary}>
                        {t('app.transactionDetail.authCode')}
                      </Typography>
                      <Typography
                        fontWeight={600}
                        color={theme.palette.primary.main}
                        fontSize={16}
                        sx={{ wordBreak: 'break-word' }}>
                        {noticeData.authCode}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} paddingTop={1} textAlign={'end'}>
                      <CopyToClipboardButton
                        value={noticeData.authCode.toString()}
                        color="primary"
                      />
                    </Grid>
                  </Grid>
                  <Divider />

                  {/* TRANSACTION ID */}
                  <Grid container>
                    <Grid item xs={10}>
                      <Stack>
                        <Typography
                          sx={{ wordBreak: 'break-word' }}
                          color={theme.palette.text.secondary}>
                          {t('app.transactionDetail.transactionId')}
                        </Typography>
                        <Typography
                          id="transaction-detail-eventId"
                          fontWeight={600}
                          color={theme.palette.primary.main}
                          fontSize={16}
                          sx={{ wordBreak: 'break-word' }}>
                          {noticeData.eventId.length > 20
                            ? noticeData.eventId.substring(0, 20) + '…'
                            : noticeData.eventId}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={2} paddingTop={1} textAlign={'end'}>
                      <CopyToClipboardButton
                        value={noticeData.eventId.toString()}
                        color="primary"
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </Grid>
  );
}
