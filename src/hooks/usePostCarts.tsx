import { useMutation } from '@tanstack/react-query';
import utils from 'utils';
import { PaymentNoticeDetailsSINGLE } from 'models/PaymentNotice';

const getRedirect = (data: string) => {
  const re = /URL=([^"]+)/;
  const match = data.match(re);
  if (!match) {
    throw new Error(`missing URL in ${data}`);
  }
  const url = match ? match[1] : 'No URL found';
  return url;
};

export const usePostCarts = ({ onSuccess }: { onSuccess: (url: string) => void }) => {
  const carts = useMutation({
    mutationFn: async ({
      singleNotice,
      email
    }: {
      singleNotice: PaymentNoticeDetailsSINGLE;
      email?: string;
    }) => {
      const request = utils.converters.singleNoticeToCartsRequest(singleNotice);
      const { data } = await utils.cartsClient.postCarts({ ...request, emailNotice: email });
      return data;
    },
    onSuccess: (data) => {
      onSuccess(getRedirect(data));
    }
  });

  return carts;
};
