import { InfoNoticeDTO } from '../../generated/apiClient';
export interface NoticeDetail {
  payer?: {
    name: string;
    taxCode?: string;
  };
  walletInfo?: InfoNoticeDTO['walletInfo'];
  paymentMethod?: InfoNoticeDTO['paymentMethod'];
  authCode: string;
  eventId: string;
  PRN: string;
  PSP: string;
  dateTime: string;
  subject: string;
  debtor: string;
  debtorFiscalCode: string;
  creditorEntity: string;
  creditorFiscalCode: string;
  noticeCode: string;
  partialAmount: string;
  fee: string;
  total: string;
  status: string;
  origin: InfoNoticeDTO['origin'];
}

export enum BRANDS {
  MASTERCARD = 'MASTERCARD',
  VISA = 'VISA',
  AMEX = 'AMEX',
  MAESTRO = 'MAESTRO',
  JCB = 'JCB',
  OTHER = 'OTHER',
  DINERS = 'DINERS',
  DISCOVER = 'DISCOVER',
  UNIONPAY = 'UNIONPAY'
}

export enum PAYMENTMETHODS {
  'BBT' = 'Bonifico Bancario Tesoreria',
  'BP' = 'Bollettino Postale',
  'AD' = 'Addebito Diretto',
  'CP' = 'Carta Pagamento',
  'PO' = 'Pagamento attivato presso PSP',
  'OBEP' = 'Online Banking Electronic Payment',
  'JIF' = 'Bancomat Pay',
  'MYBK' = 'MyBank Seller Bank',
  'PPAL' = 'PayPal',
  'UNKNOWN' = 'Sconosciuto'
}
