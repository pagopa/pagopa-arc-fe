import React from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Theme } from './utils/style';
import { Layout } from './components/Layout';
import { ArcRoutes } from './routes/routes';
import TransactionRoute from './routes/Transaction';
import DashboardRoute from './routes/Dashboard';
import { theme } from '@pagopa/mui-italia';
import UserRoute from 'routes/User';
import { RouteHandleObject } from 'models/Breadcrumbs';
import TransactionsList from 'routes/TransactionsList';
import utils from 'utils';

const router = createBrowserRouter([
  {
    path: '*',
    element: <Navigate replace to={ArcRoutes.DASHBOARD} />
  },

  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: ArcRoutes.USER,
        element: <UserRoute />,
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
        loader: utils.loaders.dashboard,
        // TEMPORARY ERROR ELEMENT
        errorElement: <p>Ops!... something went wrong</p>
      },
      {
        path: ArcRoutes.TRANSACTION,
        element: <TransactionRoute />,
        loader: ({ params }) => utils.loaders.transactionDetails(params.id),
        // TEMPORARY ERROR ELEMENT
        errorElement: <p>Ops!... something went wrong</p>,
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
        element: <TransactionsList />,
        loader: utils.loaders.transactionList,
        // TEMPORARY ERROR ELEMENT
        errorElement: <p>Ops!... something went wrong</p>
      }
    ]
  }
]);

// INSTANT FEEDBACK WHEN DEVELOPING LOCALLY
utils.config.env === 'LOCAL' &&
  (async () => {
    try {
      await utils.apiClient.info.healthCheck();
    } catch (e) {
      console.error(e, 'Mock not available or /info not reachable');
    }
  })();

export const App = () => (
  <Theme>
    <RouterProvider router={router} />
  </Theme>
);
