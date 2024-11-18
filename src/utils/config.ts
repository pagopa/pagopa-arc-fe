import { RootLinkType } from '@pagopa/mui-italia';
import { z, ZodError } from 'zod';

/** Useful default values  */
/** APIHOST default value works in conjunction with the proxy server. See the .proxyrc file */
const {
  APIHOST = 'http://localhost:1234/api',
  ENV = 'LOCAL',
  ENTITIES_LOGO_CDN,
  CHECKOUT_HOST = 'https://dev.checkout.pagopa.it',
  LOGIN_URL = 'https://api.dev.cittadini-p4pa.pagopa.it/arc/v1/login/oneidentity',
  CHECKOUT_PLATFORM_URL = 'https://api.dev.platform.pagopa.it/checkout/ec/v1',
  PAYMENT_RETURN_URL = 'http://localhost:1234',
  DEPLOY_PATH = '/pagamenti',
  VERSION = ''
} = process.env;

type ENVIRONMENT = 'LOCAL' | 'DEV' | 'UAT' | 'PROD';

// ENV variables validation
const ENV_Schema: z.ZodType<ENVIRONMENT> = z.enum(['LOCAL', 'DEV', 'UAT', 'PROD']);
const VERSION_schema = z.string();
const APIHOST_schema = z.string().url();
const ENTITIES_LOGO_CDN_schema = z.string().url();
const CHECKOUT_HOST_schema = z.string().url();
const LOGIN_URL_schema = z.string().url();
const CHECKOUT_PLATFORM_URL_schema = z.string().url();
const PAYMENT_RETURN_URL_schema = z.string().url();
const DEPLOY_PATH_schema = z.string();
try {
  ENV_Schema.parse(process.env.ENV);
  APIHOST_schema.parse(process.env.APIHOST);
  ENTITIES_LOGO_CDN_schema.parse(process.env.ENTITIES_LOGO_CDN);
  CHECKOUT_HOST_schema.parse(process.env.CHECKOUT_HOST);
  LOGIN_URL_schema.parse(process.env.LOGIN_URL);
  CHECKOUT_PLATFORM_URL_schema.parse(process.env.CHECKOUT_PLATFORM_URL);
  VERSION_schema.parse(process.env.VERSION);
  PAYMENT_RETURN_URL_schema.parse(process.env.PAYMENT_RETURN_URL);
  DEPLOY_PATH_schema.parse(process.env.DEPLOY_PATH);
} catch (e) {
  console.error('ENV variables validation fails', (e as ZodError).issues);
}

type Config = {
  env: ENVIRONMENT;
  version: string;
  baseURL: string;
  pagopaLink: RootLinkType;
  entitiesLogoCdn?: string;
  assistanceLink: string;
  checkoutHost: string;
  missingValue: string;
  loginUrl: string;
  tokenHeaderExcludePaths: string[];
  checkoutPlatformUrl: string;
  paymentReturnUrl: string;
  deployPath: string;
};

const assistanceLink: string = 'pagamenti@assistenza.pagopa.it';

const pagopaLink: RootLinkType = {
  label: 'PagoPA S.p.A.',
  href: 'https://www.pagopa.it/',
  ariaLabel: 'Link: vai al sito di PagoPA S.p.A.',
  title: 'Sito di PagoPA S.p.A.'
};

const config: Config = {
  /** Running environment, usually valued by pipelines */
  env: ENV as ENVIRONMENT,
  /** Running version, usually valued by pipelines */
  version: VERSION,
  /** the prefix of all api calls
   *  works in conjunction with the auto generated API client
   *  see the command generate in the package.json file
   */
  baseURL: APIHOST,
  pagopaLink,
  entitiesLogoCdn: ENTITIES_LOGO_CDN,
  assistanceLink,
  checkoutHost: CHECKOUT_HOST,
  loginUrl: LOGIN_URL,
  checkoutPlatformUrl: CHECKOUT_PLATFORM_URL,
  paymentReturnUrl: PAYMENT_RETURN_URL,
  deployPath: DEPLOY_PATH,
  /** a global character to be shown
   * when a info is missing
   */
  missingValue: '-',
  /** This array is populated by paths that don't need a auth token */
  tokenHeaderExcludePaths: ['/token/oneidentity']
};

export default config;
