import React from 'react';
import { PaymentNotice } from 'components/PaymentNotice';
import { Navigate, useLoaderData } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from '@tanstack/react-query';
import { PaymentNoticeDetailsType } from 'models/PaymentNotice';
import { ArcRoutes } from 'routes/routes';

type NoticeDetailLoader = () => UseQueryResult<PaymentNoticeDetailsType, Error>;

export default function PaymentNoticeDetail() {
  // loader function is passed from the navigation router
  const noticeDetailQuery = useLoaderData() as NoticeDetailLoader;

  const { data: paymentNotice, isSuccess, isError } = noticeDetailQuery();

  const { t } = useTranslation();

  if (isError) {
    return <Navigate to={ArcRoutes.PAYMENT_NOTICES} />;
  }

  return (
    <>
      <Helmet>
        <title>{`${t('pageTitles.paymentnotice')} - ${t('app.title')} `}</title>
      </Helmet>
      {isSuccess && <PaymentNotice.Detail paymentNotice={paymentNotice} />}
    </>
  );
}
