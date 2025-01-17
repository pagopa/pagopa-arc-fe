import {
  InstallmentDTO,
  PaymentNoticeDetailsDTO,
  PaymentNoticeDTO,
  PaymentOptionDetailsDTO,
  PaymentOptionDTO
} from '../../generated/apiClient';

export enum PaymentNoticeEnum {
  SINGLE = 'single',
  MULTIPLE = 'multiple'
}

export type NoticeImage = {
  src: string;
  alt: string;
};

export type PaymentNoticeEnhanced = Omit<PaymentNoticeDTO, 'paymentOptions'> & {
  image: NoticeImage;
  type: PaymentNoticeEnum;
};

export type PaymentInstallmentType = Omit<InstallmentDTO, 'amount'> & {
  amount: string;
  dueDate: string;
};

export type PaymentOptionType = Omit<PaymentOptionDTO, 'amount' | 'installments'> & {
  amount: string;
  amountValue: number;
  dueDate: string;
  description: string;
  installments: PaymentInstallmentType[] | PaymentInstallmentType;
};

export type PaymentOptionSingle = PaymentOptionType & {
  installments: PaymentInstallmentType;
};

export type PaymentOptionMultiple = PaymentOptionType & {
  installments: PaymentInstallmentType[];
};

export type PaymentNoticeMultipleType = PaymentNoticeEnhanced & {
  type: PaymentNoticeEnum.MULTIPLE;
  paymentOptions: PaymentOptionMultiple[];
};

export type PaymentNoticeSingleType = PaymentNoticeEnhanced & {
  type: PaymentNoticeEnum.SINGLE;
  paymentOptions: PaymentOptionSingle;
};

export type PaymentNoticeType = PaymentNoticeSingleType | PaymentNoticeMultipleType;

// PAYMENT NOTICE DETAILS

export type PaymentNoticeDetailsEnhanced = Omit<PaymentNoticeDetailsDTO, 'paymentOptions'> & {
  iupd: string;
  paTaxCode: string;
  paFullName: string;
};

export type PaymentOptionsDetailsType = Omit<PaymentOptionDetailsDTO, 'amount'> & {
  nav: string;
  iuv: string;
  dueDate: string;
  description: string;
  amount: string;
  amountValue: number;
};

export type PaymentNoticeDetailsSINGLE = PaymentNoticeDetailsEnhanced & {
  type: PaymentNoticeEnum.SINGLE;
  paymentOptions: PaymentOptionsDetailsType;
};

export type PaymentNoticeDetailsMULTIPLE = PaymentNoticeDetailsEnhanced & {
  type: PaymentNoticeEnum.MULTIPLE;
  paymentOptions: PaymentOptionsDetailsType[];
};

export type PaymentNoticeDetailsType = PaymentNoticeDetailsSINGLE | PaymentNoticeDetailsMULTIPLE;
