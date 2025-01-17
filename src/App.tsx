import React from 'react';
import { Navigate, RouterProvider, createBrowserRouter, useRouteError } from 'react-router-dom';
import { Theme } from './utils/style';
import { Layout } from './components/Layout';
import { ArcRoutes } from './routes/routes';
import TransactionRoute from './routes/Transaction';
import DashboardRoute from './routes/Dashboard';
import { theme } from '@pagopa/mui-italia';
import UserRoute from 'routes/User';
import { RouteHandleObject } from 'models/Breadcrumbs';
import NoticesList from 'routes/NoticesList';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { ErrorFallback } from 'components/ErrorFallback';
import { HealthCheck } from 'components/HealthCheck';
import { CourtesyPage } from 'routes/CourtesyPage';
import Login from 'routes/Login';
import Assistance from 'routes/Assistance';
import { PaymentNotices } from 'routes/PaymentNotices';
import PaymentNoticeDetail from 'routes/PaymentNoticeDetail';
import { RouteGuard } from 'components/RouteGuard';
import utils from 'utils';
import AuthCallback from 'routes/AuthCallback';
import Resources from 'routes/Resources';
import loaders, { getTokenOneidentity } from 'utils/loaders';
import { PreLoginLayout } from 'components/PreLoginLayout';
import { ApiClient } from 'components/ApiClient';

const router = createBrowserRouter([
  {
    element: <ApiClient client={utils.apiClient} />,
    children: [
      {
        path: '*',
        element: <Navigate replace to={ArcRoutes.DASHBOARD} />,
        ErrorBoundary: () => {
          throw useRouteError();
        }
      },
      {
        path: ArcRoutes.COURTESY_PAGE,
        element: (
          <PreLoginLayout>
            <CourtesyPage />
          </PreLoginLayout>
        )
      },
      {
        path: ArcRoutes.LOGIN,
        element: (
          <PreLoginLayout>
            <Login />
          </PreLoginLayout>
        )
      },
      {
        path: ArcRoutes.RESOURCES,
        element: (
          <PreLoginLayout>
            <Resources />
          </PreLoginLayout>
        ),
        errorElement: <ErrorFallback />
      },
      {
        path: ArcRoutes.AUTH_CALLBACK,
        element: <AuthCallback />,
        loader: ({ request }) => getTokenOneidentity(request)
      },
      {
        path: ArcRoutes.DASHBOARD,
        element: (
          <RouteGuard
            itemKeys={['accessToken']}
            storage={window.localStorage}
            redirectTo={ArcRoutes.LOGIN}>
            <Layout />
          </RouteGuard>
        ),
        ErrorBoundary: () => {
          throw useRouteError();
        },
        children: [
          {
            path: ArcRoutes.ASSISTANCE,
            element: <Assistance />,
            errorElement: <ErrorFallback />,
            handle: {
              backButton: false,
              sidebar: {
                visibile: false
              }
            } as RouteHandleObject
          },
          {
            path: ArcRoutes.USER,
            element: <UserRoute />,
            errorElement: <ErrorFallback />,
            handle: {
              backButton: true,
              sidebar: {
                visibile: false
              }
            } as RouteHandleObject
          },
          {
            path: ArcRoutes.DASHBOARD,
            element: <DashboardRoute />,
            // TEMPORARY ERROR ELEMENT
            errorElement: <ErrorFallback />
          },
          {
            path: ArcRoutes.TRANSACTION,
            element: <TransactionRoute />,
            loader: ({ params }) => Promise.resolve(params.id),
            // TEMPORARY ERROR ELEMENT
            errorElement: <ErrorFallback />,
            handle: {
              crumbs: {
                elements: [
                  { name: 'transactions', fontWeight: 600, href: ArcRoutes.TRANSACTIONS },
                  {
                    name: 'transactionDetail',
                    fontWeight: 400,
                    color: theme.palette.grey[700]
                  }
                ]
              }
            } as RouteHandleObject
          },
          {
            path: ArcRoutes.TRANSACTIONS,
            element: <NoticesList />,
            // TEMPORARY ERROR ELEMENT
            errorElement: <ErrorFallback />
          },
          {
            path: ArcRoutes.PAYMENT_NOTICES,
            element: <PaymentNotices />,
            errorElement: <ErrorFallback />
          },

          {
            path: ArcRoutes.PAYMENT_NOTICE_DETAIL,
            element: <PaymentNoticeDetail />,
            errorElement: <ErrorFallback />,
            loader: loaders.getPaymentNoticeDetails,
            handle: {
              crumbs: {
                elements: [
                  { name: 'paymentNotices', fontWeight: 600, href: ArcRoutes.PAYMENT_NOTICES },
                  {
                    name: 'paymentNoticeDetail',
                    fontWeight: 400,
                    color: theme.palette.grey[700]
                  }
                ]
              }
            }
          }
        ]
      }
    ]
  }
]);

export const App = () => (
  <ErrorBoundary fallback={<ErrorFallback onReset={() => window.location.replace('/')} />}>
    <HealthCheck />
    <Theme>
      <RouterProvider router={router} />
    </Theme>
  </ErrorBoundary>
);
