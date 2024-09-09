import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { mockNotice } from 'stories/utils/PaymentNoticeMocks';
import { PaymentNoticeEnum, PaymentNoticeMultipleType } from 'models/PaymentNotice';
import { PaymentNotice } from './PaymentNotice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: jest.fn()
}));

jest.mock('@preact/signals-react', () => ({
  signal: jest.fn(),
  effect: jest.fn()
}));

describe('Detail Component', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    const theme = createTheme();
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>{ui}</ThemeProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key
    });
  });

  it('renders the single notice data', () => {
    renderWithTheme(<PaymentNotice.Detail paymentNotice={mockNotice} />);

    expect(screen.getByText(mockNotice.iupd)).toBeInTheDocument();
    expect(screen.getByText(mockNotice.paFullName)).toBeInTheDocument();
    expect(screen.getByText(mockNotice.paymentOptions.description)).toBeInTheDocument();
    expect(screen.getAllByText(mockNotice.paymentOptions.amount).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(mockNotice.paymentOptions.dueDate).length).toBeGreaterThanOrEqual(1);
  });

  it('does not render multiple notice data', () => {
    renderWithTheme(
      <PaymentNotice.Detail
        paymentNotice={
          {
            ...mockNotice,
            type: PaymentNoticeEnum.MULTIPLE
          } as unknown as PaymentNoticeMultipleType
        }
      />
    );

    expect(screen.getByText('Multiple PaymentNotice type is not supported')).toBeInTheDocument();
  });
});
