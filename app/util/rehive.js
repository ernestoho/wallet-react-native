import Rehive from 'rehive';
import company_configs from './../config/company_configs';
import defaultCompanyConfig from './../config/default_company_config.json';

const stellar_service_url = 'https://stellar.services.rehive.io/api/1';
const bitcoin_service_url = 'https://bitcoin.s.services.rehive.io/api/1';
const ethereum_service_url = 'https://ethereum.s.services.rehive.io/api/1';
const rewards_service_url = 'https://reward.services.rehive.io/api';

// SDK initialization
export let r;
let token = '';
export const initWithoutToken = () => {
  r = new Rehive({ apiVersion: 3 });
  // r = new Rehive({ apiVersion: 3, network: 'staging' });
  token = '';
};
export const initWithToken = apiToken => {
  r = new Rehive({ apiVersion: 3, apiToken });
  // r = new Rehive({ apiVersion: 3, apiToken, network: 'staging' });
  token = apiToken;
};
export const verifyToken = token => r.auth.tokens.verify({ token });

/* AUTHENTICATION */
export const login = data =>
  r.auth.login(data, { session_duration: 2592000000 });

export const register = data =>
  r.auth.register(data, { session_duration: 2592000000 });

export const logout = () => r.auth.logout();

export const resendEmailVerification = (email, company) =>
  r.auth.email.resendEmailVerification({ email, company });

export const resendMobileVerification = (mobile, company) =>
  r.auth.mobile.resendMobileVerification({ mobile, company });

export const resetPassword = data => r.auth.password.reset(data);

export const changePassword = data => r.auth.password.change(data);

export const submitOTP = otp => r.auth.mobile.verify({ otp });

/* MULTI FACTOR AUTHENTICATION */
export const getMFA = () => r.auth.mfa.status.get();

export const getMFA_SMS = () => r.auth.mfa.sms.get();

export const enableAuthSMS = mobile_number =>
  r.auth.mfa.sms.enable({ mobile_number });

export const disableAuthSMS = () => r.auth.mfa.sms.disable();

export const sendAuthSMS = () => r.auth.mfa.sms.send();

export const getMFA_Token = () => r.auth.mfa.token.get();

export const enableAuthToken = () => r.auth.mfa.token.enable();

export const disableAuthToken = () => r.auth.mfa.token.disable();

export const verifyMFA = token => r.auth.mfa.verify({ token });

/* USERS */
// Profile
export const getProfile = () => r.user.get();

export const updateProfile = data => r.user.update(data);

export const updateProfileImage = file => {
  let formData = new FormData();
  formData.append('profile', file);
  return r.user.update(formData);
};

// Address
export const getAddresses = () => r.user.addresses.get();

export const createAddress = data => r.user.addresses.create(data);

export const updateAddress = data => r.user.addresses.update(data);

export const deleteAddress = id => r.user.addresses.delete(id);

// Bank Accounts
export const getBankAccounts = () => r.user.bankAccounts.get();

export const createBankAccount = data => r.user.bankAccounts.create(data);

export const updateBankAccount = (id, data) =>
  r.user.bankAccounts.update(id, data);

export const deleteBankAccount = id => r.user.bankAccounts.delete(id);

// Crypto Accounts
export const getCryptoAccounts = () => r.user.cryptoAccounts.get();

export const createCryptoAccount = data => r.user.cryptoAccounts.create(data);

export const updateCryptoAccount = (id, data) =>
  r.user.cryptoAccounts.update(id, data);

export const deleteCryptoAccount = id => r.user.cryptoAccounts.delete(id);

// Documents
export const getDocuments = () => r.user.documents.get();

export const createDocument = ({ file, category, type }) => {
  let formData = new FormData();
  formData.append('file', file);
  formData.append('document_category', category);
  formData.append('document_type', type);
  console.log('formData', formData);
  return r.user.documents.create(formData);
};

// Emails
export const getEmails = () => r.user.emails.get();

export const createEmail = data => r.user.emails.create(data);

export const updateEmail = (id, data) => r.user.emails.update(id, data);

export const deleteEmail = id => r.user.emails.delete(id);

// Mobiles
export const getMobiles = () => r.user.mobiles.get();

export const updateMobile = (id, data) => r.user.mobiles.update(id, data);

export const createMobile = data => r.user.mobiles.create(data);

export const deleteMobile = id => r.user.mobiles.delete(id);

/* TRANSACTIONS */
export const getTransactions = filters => r.transactions.get({ filters });

export const createCredit = (amount, currency) =>
  r.transactions.createCredit({
    amount: parseInt(amount, 0),
    currency,
  });

export const createDebit = (amount, currency, reference, note, metadata) =>
  r.transactions.createDebit({
    amount: parseInt(amount, 0),
    currency,
    metadata,
    reference,
    note,
  });

export const createTransfer = data => r.transactions.createTransfer(data);

/* ACCOUNTS */
export const getAccounts = () => r.accounts.get();

// Create, retrieve, currencies?

export const setActiveCurrency = (reference, currencyCode) =>
  r.accounts.currencies.update(reference, currencyCode, { active: true });

/* COMPANY */
export const getCompany = () => r.company.get();

export const getCompanyCurrencies = () => r.company.currencies.get();

export const getCompanyBankAccounts = () => r.company.bankAccounts.get();

export const getCompanyConfig = company => {
  if (company_configs[company]) {
    return company_configs[company];
  }
  return defaultCompanyConfig;
};

/* CRYPTO */
export const getStellarAssets = () =>
  callApi('GET', stellar_service_url + '/company/assets/');

export const setStellarUsername = data =>
  callApi('POST', stellar_service_url + '/user/username/set/', data);

export const getStellarUser = () =>
  callApi('GET', stellar_service_url + '/user/');

export const createTransferStellar = data =>
  new Promise((resolve, reject) =>
    callApi('POST', stellar_service_url + '/transactions/send/', data)
      .then(response => resolve(response))
      .catch(err => reject(err)),
  );

export const getBitcoinUser = () =>
  callApi('GET', bitcoin_service_url + '/user/');

export const createTransferBitcoin = data =>
  new Promise((resolve, reject) =>
    callApi('POST', bitcoin_service_url + '/transactions/send/', data)
      .then(response => resolve(response))
      .catch(err => reject(err)),
  );

export const getEthereumUser = () =>
  callApi('GET', ethereum_service_url + '/user/');

export const createTransferEthereum = data =>
  new Promise((resolve, reject) =>
    callApi('POST', ethereum_service_url + '/wallet/send/', data)
      .then(response => resolve(response))
      .catch(err => reject(err)),
  );

/* REWARDS */
export const getRewards = () =>
  callApi('GET', rewards_service_url + '/user/rewards/');

export const claimReward = data =>
  callApi('POST', rewards_service_url + '/user/rewards/', data);

export const getCampaigns = () =>
  callApi('GET', rewards_service_url + '/user/campaigns/');

/* GENERAL */
export const callApi = (method, route, data) => {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = 'Token ' + token;
  }

  let config = {
    // credentials: 'include',
    method,
    mode: 'cors',
    headers,
  };
  if (data) {
    config['body'] = JSON.stringify(data);
  }
  // console.log(config);
  return Promise.resolve(
    fetch(route, config)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return response;
        }
      })
      .catch(err => err),
  );
};
