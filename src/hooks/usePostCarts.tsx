import { useMutation } from '@tanstack/react-query';
import utils from 'utils';
import { CartItem } from 'models/Cart';

const getRedirect = (data: string) => {
  const re = /URL=([^"]+)/;
  const match = data.match(re);
  if (!match) {
    throw new Error(`missing URL in ${data}`);
  }
  const url = match ? match[1] : 'No URL found';
  return url;
};

export const usePostCarts = ({
  onSuccess,
  onError
}: {
  onSuccess: (url: string) => void;
  onError?: () => void;
}) => {
  const carts = useMutation({
    mutationFn: async ({ notices, email }: { notices: CartItem[]; email?: string }) => {
      const request = utils.converters.cartItemsToCartsRequest(notices);
      const { data } = await utils.cartsClient.postCarts({ ...request, emailNotice: email });
      return data;
    },
    onSuccess: (data) => {
      onSuccess(getRedirect(data));
    },
    onError
  });

  return carts;
};
