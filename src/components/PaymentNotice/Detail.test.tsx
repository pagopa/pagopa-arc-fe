import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { mockNoticeDetails } from 'stories/utils/PaymentNoticeMocks';
import { PaymentNoticeDetailsMULTIPLE, PaymentNoticeEnum } from 'models/PaymentNotice';
import { PaymentNotice } from './PaymentNotice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { i18nTestSetup } from '__tests__/i18nTestSetup';

i18nTestSetup({});

const queryClient = new QueryClient();

describe('Detail Component', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    const theme = createTheme();
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </QueryClientProvider>
    );
  };

  it('renders the single notice data', () => {
    renderWithTheme(<PaymentNotice.Detail paymentNotice={mockNoticeDetails} />);

    expect(screen.getByText(mockNoticeDetails.paymentOptions.iuv)).toBeInTheDocument();
    expect(screen.getByText(mockNoticeDetails.paFullName)).toBeInTheDocument();
    expect(screen.getByText(mockNoticeDetails.paymentOptions.description)).toBeInTheDocument();
    expect(
      screen.getAllByText(mockNoticeDetails.paymentOptions.dueDate).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('does not render multiple notice data', () => {
    renderWithTheme(
      <PaymentNotice.Detail
        paymentNotice={
          {
            ...mockNoticeDetails,
            type: PaymentNoticeEnum.MULTIPLE
          } as unknown as PaymentNoticeDetailsMULTIPLE
        }
      />
    );

    expect(screen.getByText('Multiple PaymentNotice type is not supported')).toBeInTheDocument();
  });
});
