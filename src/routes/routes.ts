import config from 'utils/config';
const deployPath = config.deployPath;

export const ArcRoutes = {
  DASHBOARD: `${deployPath}/`,
  TRANSACTION: `${deployPath}/transactions/:id`,
  TRANSACTIONS: `${deployPath}/transactions/`,
  PAYMENT_NOTICES: `${deployPath}/payment-notices/`,
  USER: `${deployPath}/user`,
  COURTESY_PAGE: `${deployPath}/courtesy`,
  LOGIN: `${deployPath}/login`,
  ASSISTANCE: `${deployPath}/assistance`,
  PAYMENT_NOTICE_DETAIL: `${deployPath}/payment-notices/:id/:paTaxCode`,
  AUTH_CALLBACK: `${deployPath}/auth-callback`,
  PRIVACY_PAGE: `${deployPath}/privacy_page`,
  RESOURCES: `${deployPath}/resources`
};
