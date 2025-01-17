import React from 'react';
import utils from 'utils';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PaymentNotice } from './index';
import { i18nTestSetup } from '__tests__/i18nTestSetup';
import { ArcRoutes } from 'routes/routes';
import { Signal } from '@preact/signals-react';

i18nTestSetup({});

vi.mock('@pagopa/mui-italia', async () => {
  const muiItalia = await vi.importActual('@pagopa/mui-italia');
  const IllusSharingInfo = vi.fn(() => <div>Illustration</div>);
  return {
    ...muiItalia,
    IllusSharingInfo
  };
});

const navigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate
}));

vi.mock('utils');

describe('PaymentNotice.Preview Component', () => {
  const renderWithTheme = (ui: React.ReactElement) => {
    const theme = createTheme();
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
  };

  it('renders the title and description', () => {
    renderWithTheme(<PaymentNotice.Preview />);

    expect(screen.getByText('app.paymentNotice.preview.title')).toBeInTheDocument();
    expect(screen.getByText('app.paymentNotice.preview.description')).toBeInTheDocument();
  });

  it('renders the action button', () => {
    renderWithTheme(<PaymentNotice.Preview />);

    expect(screen.getByText('app.paymentNotice.preview.action')).toBeInTheDocument();
  });

  it('renders the illustration on large screens', () => {
    renderWithTheme(<PaymentNotice.Preview />);

    // Simulate a large screen
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('min-width'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn()
    }));

    renderWithTheme(<PaymentNotice.Preview />);

    expect(screen.getByText('Illustration')).toBeInTheDocument();
  });

  it('does not render the illustration on small screens', () => {
    // Simulate a small screen
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: !query.includes('min-width'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn()
    }));

    renderWithTheme(<PaymentNotice.Preview />);

    expect(screen.queryByText('Illustration')).not.toBeInTheDocument();
  });

  it('Call use navigate on CTA click if the user did the opt-in', () => {
    vi.spyOn(utils.storage.pullPaymentsOptIn, 'get').mockReturnValue({
      value: true
    } as Signal<boolean>);

    renderWithTheme(<PaymentNotice.Preview />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(utils.modal.open).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(ArcRoutes.PAYMENT_NOTICES);
  });

  it('Open a modal on CTA click if the user needs to do the opt-in', () => {
    vi.spyOn(utils.storage.pullPaymentsOptIn, 'get').mockReturnValue({
      value: false
    } as Signal<boolean>);

    renderWithTheme(<PaymentNotice.Preview />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(utils.modal.open).toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
