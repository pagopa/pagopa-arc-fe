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

// Mock the utils module
vi.mock('utils', () => {
  const originalModule = vi.importActual('utils');
  return {
    ...originalModule,
    apiClient: {
      transactions: {
        getTransactionsList: vi.fn(),
        getTransactionDetails: vi.fn(),
        getTransactionReceipt: vi.fn()
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

vi.mock('@preact/signals-react', () => ({
  signal: vi.fn(),
  effect: vi.fn()
}));

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

  describe('transactionsApi', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('getTransactions calls API and schema parser correctly', async () => {
      // you can generate a specific field, even if optionale, using .require()
      const dataMock = createMock(schemas.transactionsListDTOSchema.required());

      const apiMock = vi
        .spyOn(utils.apiClient.transactions, 'getTransactionsList')
        .mockResolvedValue({ data: dataMock } as AxiosResponse);

      const { result } = renderHook(() => loaders.getTransactions(), { wrapper });

      await waitFor(() => {
        expect(apiMock).toHaveBeenCalled();
        expect(result.current.isSuccess).toBeTruthy();
        expect(result.current.data).toEqual(dataMock);
      });
    });

    it('getTransactionDetails calls API and schema parser correctly', async () => {
      const dataMock = createMock(schemas.transactionDetailsDTOSchema);

      const transactionId = dataMock.infoTransaction?.transactionId;

      const apiMock = vi
        .spyOn(utils.apiClient.transactions, 'getTransactionDetails')
        .mockResolvedValue({ data: dataMock } as AxiosResponse);

      const { result } = renderHook(() => loaders.getTransactionDetails(transactionId as string), {
        wrapper
      });

      await waitFor(() => {
        expect(apiMock).toHaveBeenCalledWith(transactionId);
        expect(result.current.isSuccess).toBeTruthy();
        expect(result.current.data).toEqual(dataMock);
      });
    });
  });

  describe('transactionReceipt', () => {
    it('getReceiptApi is called', async () => {
      const transactionId = '1';

      const apiMock = vi
        .spyOn(utils.apiClient.transactions, 'getTransactionReceipt')
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
  });
});
