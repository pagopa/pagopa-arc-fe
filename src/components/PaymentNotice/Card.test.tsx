import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { _Card } from './Card';
import { mockNotice } from 'stories/utils/PaymentNoticeMocks';
import utils from 'utils';
import { Mock } from 'vitest';
import { i18nTestSetup } from '__tests__/i18nTestSetup';

i18nTestSetup({});

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const theme = createTheme();

  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('_Card component', () => {
  const navigate = vi.fn();

  beforeEach(() => {
    (useNavigate as Mock).mockReturnValue(navigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly', () => {
    renderWithProviders(<_Card {...mockNotice} />);

    expect(screen.getByText(mockNotice.paFullName)).toBeInTheDocument();
    expect(screen.getByText(mockNotice.paymentOptions.description)).toBeInTheDocument();
  });

  test('navigates to the correct route and sets state when button is clicked', () => {
    renderWithProviders(<_Card {...mockNotice} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(navigate).toHaveBeenCalledWith(
      `${utils.config.deployPath}/payment-notices/${mockNotice.iupd}/${mockNotice.paTaxCode}`
    );
  });
});
