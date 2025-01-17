import React from 'react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLoaderData } from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import { PaymentNoticeDetailsType } from 'models/PaymentNotice';
import { ArcRoutes } from 'routes/routes';
import PaymentNoticeDetail from '.';
import { Helmet } from 'react-helmet';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn(),
    Navigate: ({ to }: { to: string }) => <div>Redirected to {to}</div>
  };
});

vi.mock('components/PaymentNotice', () => ({
  PaymentNotice: {
    Detail: ({ paymentNotice }: { paymentNotice: PaymentNoticeDetailsType }) => (
      <div>PaymentNotice.Detail: {paymentNotice?.iupd}</div>
    )
  }
}));

describe('PaymentNoticeDetail', () => {
  const mockUseLoaderData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoaderData as Mock).mockImplementation(mockUseLoaderData); // Ensure the mock works
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <PaymentNoticeDetail />
      </MemoryRouter>
    );

  it('renders the payment notice details when query is successful', () => {
    const mockNoticeDetailQuery: UseQueryResult<PaymentNoticeDetailsType, Error> = {
      data: { iupd: '12345' } as PaymentNoticeDetailsType,
      isSuccess: true,
      isError: false
    } as UseQueryResult<PaymentNoticeDetailsType, Error>;

    mockUseLoaderData.mockReturnValue(() => mockNoticeDetailQuery);

    renderComponent();

    expect(screen.getByText('PaymentNotice.Detail: 12345')).toBeInTheDocument();
  });

  it('redirects to payment notices route when query fails', () => {
    const mockNoticeDetailQuery: UseQueryResult<PaymentNoticeDetailsType, Error> = {
      isSuccess: false,
      isError: true
    } as UseQueryResult<PaymentNoticeDetailsType, Error>;

    mockUseLoaderData.mockReturnValue(() => mockNoticeDetailQuery);

    renderComponent();

    expect(screen.getByText(`Redirected to ${ArcRoutes.PAYMENT_NOTICES}`)).toBeInTheDocument();
  });

  it('renders the page title', () => {
    const mockNoticeDetailQuery: UseQueryResult<PaymentNoticeDetailsType, Error> = {
      isSuccess: true,
      isError: false,
      data: { iupd: '12345' } as PaymentNoticeDetailsType
    } as UseQueryResult<PaymentNoticeDetailsType, Error>;

    mockUseLoaderData.mockReturnValue(() => mockNoticeDetailQuery);

    renderComponent();
    const helmet = Helmet.peek();
    expect(helmet.title).toContain('pageTitles.paymentnotice');
    expect(helmet.title).toContain('app.title');
  });
});
