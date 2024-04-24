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
          sidebar: {
            visibile: false
          },
          crumbs: {
            backButton: true,
            elements: [
              { name: 'home', fontWeight: 600, href: ArcRoutes.DASHBOARD },
              {
                name: 'user',
                fontWeight: 400,
                color: theme.palette.text.disabled
              }
            ]
          }
        } as RouteHandleObject
      },
      {
        path: ArcRoutes.DASHBOARD,
        element: <DashboardRoute />
      },
      {
        path: ArcRoutes.TRANSACTION,
        element: <TransactionRoute />,
        handle: {
          crumbs: {
            backButton: false,
            elements: [
              { name: 'transactions', fontWeight: 600, href: ArcRoutes.TRANSACTIONS },
              {
                name: 'transactionDetail',
                fontWeight: 400,
                color: theme.palette.text.disabled
              }
            ]
          }
        } as RouteHandleObject
      }
    ]
  }
]);

export const App = () => (
  <Theme>
    <RouterProvider router={router} />
  </Theme>
);
