import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { theme } from '@pagopa/mui-italia';
import { Layout } from './components/Layout';
import { useTranslation } from 'react-i18next';

import './translations/i18n';
import { ArcRoutes } from './routes/routes';
import Transaction from './routes/Transaction';

const customTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    background: {
      paper: '#F5F5F5', // mui-italia paper is defined as #FFFFFF
      default: '#FFFFFF' // mui-italia default is defined as '#F2F2F2'
    }
  }
});

export const App = () => {
  const { t } = useTranslation();
  document.title = t('app.title');

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path={'/'} element={<>{t('app.title')}</>} />
            <Route path="*" element={<Navigate replace to="/" />} />
            <Route path={`/${ArcRoutes.TRANSACTION}/:ID`} element={<Transaction />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
};
