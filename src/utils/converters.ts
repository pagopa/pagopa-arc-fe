import { TransactionProps } from 'components/Transactions/Transaction';
import {
  PaymentNoticeDTO,
  PaymentNoticesListDTO,
  PaymentOptionDTO,
  NoticesListDTO,
  NoticeDetailsDTO,
  InfoNoticeDTO,
  PaymentNoticeDetailsDTO
} from '../../generated/apiClient';
import { NoticeDetail } from 'models/NoticeDetail';
import { DateFormat, datetools } from './datetools';
import utils from 'utils';
import {
  NoticeImage,
  PaymentInstallmentType,
  PaymentNoticeDetailsSINGLE,
  PaymentNoticeDetailsType,
  PaymentNoticeEnum,
  PaymentNoticeType,
  PaymentOptionMultiple,
  PaymentOptionSingle,
  PaymentOptionType
} from 'models/PaymentNotice';

// This high order function is useful to 'decorate' existing function to add
// the functionality to manage undefined (not optional) parameters and output a global character instead
const withMissingValue =
  <P extends unknown[], R>(f: (...args: P) => R, missingValue?: string) =>
  (...args: { [K in keyof P]: P[K] | undefined }) => {
    return [...args].every((arg) => arg !== undefined)
      ? f(...(args as P))
      : missingValue || utils.config.missingValue;
  };

const fromTaxCodeToSrcImage = (payeeTaxCode: string) =>
  `${utils.config.entitiesLogoCdn}/${payeeTaxCode.replace(/^0+/, '')}.png`;

const toEuro = (amount: number, decimalDigits: number = 2, fractionDigits: number = 2): string =>
  new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(amount / Math.pow(10, decimalDigits));

const toEuroOrMissingValue = withMissingValue(toEuro);
const formatDateOrMissingValue = withMissingValue(datetools.formatDate);
const propertyOrMissingValue = withMissingValue((property: string) => property);

interface PrepareRowsData {
  notices: NoticesListDTO['notices'];
  status: {
    label: string;
    color?: string;
  };
  payee: {
    /** text to shown when more than an entities are in involved within a single transaction */
    multi: string;
    /** alt text for entity logo */
    altImg?: string;
  };
}

/** This function transforms Transaction[] list returned by transaction service into transactionProps[] item */
const prepareRowsData = (data: PrepareRowsData): TransactionProps[] => {
  return (
    data.notices?.map((element) => ({
      date: formatDateOrMissingValue(element.noticeDate),
      amount: toEuroOrMissingValue(element.amount),
      id: propertyOrMissingValue(element.eventId),
      payee: {
        name: element.payeeName || data.payee.multi,
        srcImg: element.payeeTaxCode && fromTaxCodeToSrcImage(element.payeeTaxCode),
        altImg: data.payee.altImg || `Logo Ente`
      },
      // needs to be updated when status can be different from success
      status: {
        label: data.status.label,
        color: 'success'
      }
    })) || []
  );
};

const prepareNoticeDetailData = (noticeDetail: NoticeDetailsDTO): NoticeDetail | undefined => {
  const { infoNotice, carts } = noticeDetail;
  return (
    infoNotice && {
      ...(infoNotice.payer &&
        infoNotice.payer.name && {
          payer: {
            name: infoNotice.payer.name,
            taxCode: propertyOrMissingValue(infoNotice.payer.taxCode)
          }
        }),
      ...(infoNotice.walletInfo &&
        infoNotice.walletInfo.accountHolder &&
        infoNotice.walletInfo.blurredNumber &&
        infoNotice.walletInfo.brand && {
          walletInfo: {
            accountHolder: infoNotice.walletInfo.accountHolder,
            brand: infoNotice.walletInfo.brand,
            blurredNumber: infoNotice.walletInfo.blurredNumber,
            maskedEmail: infoNotice.walletInfo.maskedEmail
          }
        }),
      paymentMethod: propertyOrMissingValue(
        infoNotice.paymentMethod
      ) as InfoNoticeDTO['paymentMethod'],
      authCode: propertyOrMissingValue(infoNotice.authCode),
      eventId: propertyOrMissingValue(infoNotice.eventId),
      PRN: propertyOrMissingValue(infoNotice.rrn),
      PSP: propertyOrMissingValue(infoNotice.pspName),
      dateTime: formatDateOrMissingValue(infoNotice.noticeDate, {
        format: DateFormat.LONG,
        withTime: true,
        second: '2-digit'
      }),
      subject: propertyOrMissingValue(carts?.[0].subject),
      debtor: propertyOrMissingValue(carts?.[0].debtor?.name),
      debtorFiscalCode: propertyOrMissingValue(carts?.[0].debtor?.taxCode),
      creditorEntity: propertyOrMissingValue(carts?.[0].payee?.name),
      creditorFiscalCode: propertyOrMissingValue(carts?.[0].payee?.taxCode),
      noticeCode: propertyOrMissingValue(carts?.[0].refNumberValue),
      partialAmount: toEuroOrMissingValue(infoNotice.amount, 2),
      fee: toEuroOrMissingValue(infoNotice.fee, 2),
      total: toEuroOrMissingValue(infoNotice.totalAmount),
      status: 'SUCCESS',
      origin: infoNotice.origin
    }
  );
};

/**
 * Transforms a PaymentOptionDTO into a PaymentOptionType.
 *
 * installments is transformed in an object if the
 * payment notice is of type SINGLE
 *
 * @param {PaymentOptionDTO} option - The payment option data transfer object.
 * @param {PaymentNoticeEnum} type - The type of the payment notice (SINGLE or MULTIPLE).
 * @returns {PaymentOptionType} The transformed payment option object.
 */
const transformPaymentOption = (
  option: PaymentOptionDTO,
  type: PaymentNoticeEnum
): PaymentOptionType => {
  const normalizedInstallments = option.installments.map<PaymentInstallmentType>(
    (installments) => ({
      ...installments,
      dueDate: formatDateOrMissingValue(installments.dueDate),
      amount: toEuroOrMissingValue(installments.amount)
    })
  );

  const out = {
    ...option,
    amount: toEuroOrMissingValue(option.amount),
    // TODO handle missing amount
    amountValue: option?.amount || 0,
    dueDate: formatDateOrMissingValue(option.dueDate),
    description: propertyOrMissingValue(option.description),
    installments:
      type == PaymentNoticeEnum.SINGLE ? normalizedInstallments[0] : normalizedInstallments
  };
  return out;
};

/**
 * Transforms a PaymentNoticeDTO into a PaymentNoticeType.
 *
 * Determines whether it's a single or multiple payment notice based on paymentOptions.length
 * and transform options and installments accordingly, changing them from a list to an object
 *
 * @param {PaymentNoticeDTO} paymentNotice - The payment notice data transfer object.
 * @returns {PaymentNoticeType} The transformed payment notice object, either as single or multiple type.
 */
const normalizePaymentNotice = (paymentNotice: PaymentNoticeDTO): PaymentNoticeType => {
  const image: NoticeImage = {
    src: fromTaxCodeToSrcImage(paymentNotice.paTaxCode),
    alt: paymentNotice.paFullName
  };
  if (paymentNotice.paymentOptions.length === 1) {
    return {
      ...paymentNotice,
      image,
      type: PaymentNoticeEnum.SINGLE,
      paymentOptions: transformPaymentOption(
        paymentNotice.paymentOptions[0],
        PaymentNoticeEnum.SINGLE
      ) as PaymentOptionSingle
    };
  } else {
    return {
      ...paymentNotice,
      image,
      type: PaymentNoticeEnum.MULTIPLE,
      paymentOptions: paymentNotice.paymentOptions.map((paymentOption) =>
        transformPaymentOption(paymentOption, PaymentNoticeEnum.MULTIPLE)
      ) as PaymentOptionMultiple[]
    };
  }
};

/**
 * Transforms a PaymentNoticeDetailsDTO into a PaymentNoticeDetailsType.
 *
 * Determines whether it's a single or multiple payment notice based on paymentOptions.length
 * and transform options and installments accordingly, changing them from a list to an object
 *
 * @param {PaymentNoticeDTO} paymentNotice - The payment notice data transfer object.
 * @returns {PaymentNoticeDetailsType} The transformed payment notice object, either as single or multiple type.
 */
const normalizePaymentNoticeDetails = (
  paymentNotice: PaymentNoticeDetailsDTO
): PaymentNoticeDetailsType => {
  if (!paymentNotice?.paymentOptions?.length) {
    throw new Error('No payment options found');
  }

  const normalized = {
    ...paymentNotice,
    iupd: propertyOrMissingValue(paymentNotice.iupd),
    paTaxCode: propertyOrMissingValue(paymentNotice.paTaxCode),
    paFullName: propertyOrMissingValue(paymentNotice.paFullName),
    paymentOptions: paymentNotice.paymentOptions.map((paymentOption) => ({
      nav: propertyOrMissingValue(paymentOption.nav),
      iuv: propertyOrMissingValue(paymentOption.iuv),
      description: propertyOrMissingValue(paymentOption.description),
      dueDate: formatDateOrMissingValue(paymentOption.dueDate),
      amount: toEuroOrMissingValue(paymentOption.amount),
      amountValue: paymentOption?.amount ?? 0
    }))
  };

  if (paymentNotice?.paymentOptions?.length === 1) {
    return {
      ...normalized,
      type: PaymentNoticeEnum.SINGLE,
      paymentOptions: {
        ...normalized.paymentOptions[0]
      }
    };
  } else {
    return {
      ...normalized,
      type: PaymentNoticeEnum.MULTIPLE
    };
  }
};

/**
 * Prepares a list of payment notices data by transforming each notice.
 *
 * @param {PaymentNoticesListDTO | undefined} data - The list of payment notices or undefined.
 * @returns {{ paymentNotices: PaymentNoticeType[] | undefined }} The transformed list of payment notices as single or multiple.
 */
const prepareNoticesData = (
  data: PaymentNoticesListDTO | undefined
): { paymentNotices: PaymentNoticeType[] | undefined } => {
  const transformed = data?.paymentNotices?.map((notice) => normalizePaymentNotice(notice));

  return { paymentNotices: transformed };
};

const singleNoticeToCartsRequest = (paymentNotice: PaymentNoticeDetailsSINGLE) => ({
  paymentNotices: [
    {
      amount: paymentNotice.paymentOptions.amountValue,
      companyName: paymentNotice.paFullName,
      description: paymentNotice.paymentOptions.description,
      fiscalCode: paymentNotice.paTaxCode,
      noticeNumber: paymentNotice.paymentOptions.nav
    }
  ],
  returnUrls: {
    returnOkUrl: utils.config.paymentReturnUrl,
    returnCancelUrl: utils.config.paymentReturnUrl,
    returnErrorUrl: utils.config.paymentReturnUrl
  }
});

/**
 * Capitalizes the first letter of each word in a string.
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export const capitalizeFirstLetter = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default {
  normalizePaymentNotice,
  normalizePaymentNoticeDetails,
  prepareNoticeDetailData,
  prepareNoticesData,
  prepareRowsData,
  singleNoticeToCartsRequest,
  toEuro,
  withMissingValue,
  capitalizeFirstLetter: withMissingValue(capitalizeFirstLetter)
};
