import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React, { ReactNode } from 'react';
import 'whatwg-fetch';
import loaders from 'utils/loaders';
import utils from 'utils';
import { StoreProvider } from 'store/GlobalStore';
import { AxiosResponse } from 'axios';

// importing schemas from utils
// causes an import resolution issue
import * as schemas from '../../generated/zod-schema';

// zodock can create mock object
// from a zod schema
// if a field is set as optionaal
// it will be generated as undefined
import { createMock } from 'zodock';
import { Params } from 'react-router-dom';
import { mockNoticeDetails, mockPaymentNoticeDetails } from 'stories/utils/PaymentNoticeMocks';

// Mock the utils module
vi.mock('./utils', () => {
  const originalModule = vi.importActual('utils');
  return {
    ...originalModule,
    apiClient: {
      notices: {
        getNoticesList: vi.fn(),
        getNoticeReceipt: vi.fn(),
        getNoticeDetails: vi.fn()
      },
      transactions: {
        getTransactionsList: vi.fn(),
        getTransactionDetails: vi.fn()
      },
      auth: {
        getUserInfo: vi.fn()
      },
      token: {
        getAuthenticationToken: vi.fn()
      }
    }
  };
});

describe('api loaders', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </StoreProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Notices API', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('getNoticesList calls API and schema parser correctly', async () => {
      // you can generate a specific field, even if optionale, using .require()
      const dataMock = createMock(schemas.noticesListDTOSchema.required());

      const apiMock = vi.spyOn(utils.apiClient.notices, 'getNoticesList').mockResolvedValue({
        data: dataMock,
        headers: {}
      } as AxiosResponse);

      const { result } = renderHook(
        () => loaders.getNoticesList({ ordering: 'DESC', size: 10 }, ''),
        { wrapper }
      );

      await waitFor(() => {
        expect(apiMock).toHaveBeenCalled();
        expect(result.current.isSuccess).toBeTruthy();
        expect(result.current.data?.notices).toEqual(dataMock.notices);
      });
    });

    it('getNoticeDetails calls API and schema parser correctly', async () => {
      const dataMock = createMock(schemas.noticeDetailsDTOSchema);

      const eventId = dataMock.infoNotice?.eventId;

      const apiMock = vi
        .spyOn(utils.apiClient.notices, 'getNoticeDetails')
        .mockResolvedValue({ data: dataMock } as AxiosResponse);

      const { result } = renderHook(() => loaders.getNoticeDetails(eventId as string), {
        wrapper
      });

      await waitFor(() => {
        expect(apiMock).toHaveBeenCalledWith(eventId);
        expect(result.current.isSuccess).toBeTruthy();
        expect(result.current.data).toEqual(dataMock);
      });
    });
  });

  describe('transactionReceipt', () => {
    it('getReceiptApi is called', async () => {
      const transactionId = '1';

      const apiMock = vi
        .spyOn(utils.apiClient.notices, 'getNoticeReceipt')
        .mockResolvedValue({ data: null } as AxiosResponse);

      renderHook(() => loaders.getReceiptData(transactionId), { wrapper });

      await waitFor(() => {
        expect(apiMock).toHaveBeenCalledWith(transactionId, { format: 'blob' });
      });
    });
  });

  describe('userInfo', () => {
    const dataMock = createMock(schemas.userInfoSchema);

    const apiMock = vi
      .spyOn(utils.apiClient.auth, 'getUserInfo')
      .mockResolvedValue({ data: dataMock } as AxiosResponse);

    it('getUserInfo api is called', async () => {
      const { result } = renderHook(() => loaders.getUserInfo(), { wrapper });

      await waitFor(() => {
        expect(apiMock).toHaveBeenCalled();
        expect(result.current.data).toEqual(dataMock);
      });
    });

    describe('getUserInfoOnce', () => {
      it('fetch if sessionStorage.userInfo is missing', async () => {
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

        const { result } = renderHook(() => loaders.getUserInfoOnce(), {
          wrapper
        });

        await waitFor(() => {
          expect(utils.apiClient.auth.getUserInfo).toHaveBeenCalled();
          expect(result.current.isSuccess).toBeTruthy();
          expect(result.current.data).toEqual(dataMock);
        });
      });

      it('does not fetch if sessionStorage.userInfo is set', async () => {
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('true');

        const { result } = renderHook(() => loaders.getUserInfoOnce(), {
          wrapper
        });

        expect(utils.apiClient.auth.getUserInfo).not.toHaveBeenCalled();
        expect(result.current.isSuccess).toBeTruthy();
        expect(result.current.fetchStatus).toBe('idle');
      });
    });
  });

  describe('getTokenOneidentity function', () => {
    it('returns Token correctly', async () => {
      const dataMock = createMock(schemas.tokenResponseSchema);

      const apiMock = vi
        .spyOn(utils.apiClient.token, 'getAuthenticationToken')
        .mockResolvedValue({ data: dataMock } as AxiosResponse);

      const request = new Request('https://website.it/auth-callback?code=code123&state=state123');
      const token = await loaders.getTokenOneidentity(request);

      expect(apiMock).toHaveBeenCalledWith(
        {
          code: 'code123',
          state: 'state123'
        },
        { withCredentials: true }
      );
      expect(token).toEqual(dataMock);
    });

    it('should return error code on failure', async () => {
      const mockRequest = (url: string): Request =>
        ({
          url
        }) as unknown as Request;

      const mockError = { response: { status: 403 } };
      vi.mocked(utils.apiClient.token.getAuthenticationToken).mockRejectedValue(mockError);

      const request = mockRequest('https://sito.it/?code=dummyCode&state=dummyState');
      const result = await loaders.getTokenOneidentity(request);

      expect(result).toBe(403);
    });
  });
});

describe('Payment Notices API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </StoreProvider>
  );

  it('getPaymentNoticeDetails calls API and schema parser correctly', async () => {
    const apiMock = vi
      .spyOn(utils.apiClient.paymentNotices, 'getPaymentNoticesDetails')
      .mockResolvedValue({ data: mockPaymentNoticeDetails } as AxiosResponse);

    const params: Params = {
      id: mockPaymentNoticeDetails.iupd,
      paTaxCode: mockPaymentNoticeDetails.paTaxCode
    };

    const { result } = renderHook(() => loaders.getPaymentNoticeDetails({ params }), {
      wrapper
    });

    const query = renderHook(() => result.current(), { wrapper });

    await waitFor(() => {
      expect(apiMock).toHaveBeenCalledWith(params.id, { paTaxCode: params.paTaxCode });
      expect(query.result.current.isSuccess).toBeTruthy();
      expect(query.result.current.data).toEqual(mockNoticeDetails);
    });
  });
});
