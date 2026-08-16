/* eslint-disable no-undef */
import axios from 'axios';

// Endpoints the browser must *navigate* to (they redirect, and in the
// case of logout across hosts) need an absolute URL. Endpoints called
// over XHR stay relative and pick up axios.defaults.baseURL.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const OAUTH_CONFIG = {
  clientId: 'anahita-web',
  redirectUri: `${window.location.origin}/oauth/callback`,
  authorizeUrl: `${API_BASE_URL}/oauth/authorize`,
  logoutUrl: `${API_BASE_URL}/oauth/logout`,
  sessionUrl: '/oauth/session',
  userinfoUrl: '/oauth/userinfo',
  // `openid` alone gets you a userinfo response containing nothing but
  // `sub`. The profile claims the app reads off the viewer — id, name,
  // username — are gated behind `profile`, and the address behind
  // `email`.
  scopes: 'openid profile email',
};

const generateRandom = (length = 43) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const login = async () => {
  const state = generateRandom(32);
  const codeVerifier = generateRandom(43);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  sessionStorage.setItem('oauth_state', state);
  sessionStorage.setItem('oauth_code_verifier', codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: OAUTH_CONFIG.clientId,
    redirect_uri: OAUTH_CONFIG.redirectUri,
    scope: OAUTH_CONFIG.scopes,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  window.location.href = `${OAUTH_CONFIG.authorizeUrl}?${params}`;
};

const exchangeCode = (code) => {
  const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
  sessionStorage.removeItem('oauth_state');
  sessionStorage.removeItem('oauth_code_verifier');

  return axios.post(OAUTH_CONFIG.sessionUrl,
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: OAUTH_CONFIG.redirectUri,
      client_id: OAUTH_CONFIG.clientId,
      code_verifier: codeVerifier,
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
};

const read = () => {
  return axios.get(OAUTH_CONFIG.userinfoUrl);
};

// Logout is a GET that answers with a chain of redirects, not an API
// call: the session cookie and the IdP cookie live on different hosts,
// so each one has to be cleared by a request the browser makes itself.
// An XHR cannot do that — it would follow the redirects same-origin and
// leave the IdP session intact — so hand the browser the URL and let it
// navigate. auth-service bounces back to return_to when it is done.
const deleteItem = () => {
  const returnTo = encodeURIComponent(window.location.origin);
  window.location.href = `${OAUTH_CONFIG.logoutUrl}?return_to=${returnTo}`;
  return Promise.resolve();
};

export default {
  read,
  login,
  exchangeCode,
  deleteItem,
};
