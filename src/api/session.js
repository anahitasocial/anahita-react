/* eslint-disable no-undef */
import axios from 'axios';
import { Auth as AUTH } from '../constants';

// Endpoints the browser must *navigate* to (they redirect, and in the
// case of logout across hosts) need an absolute URL. Endpoints called
// over XHR stay relative and pick up axios.defaults.baseURL.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const OAUTH_CONFIG = {
  clientId: 'anahita-web',
  redirectUri: `${window.location.origin}/oauth/callback`,
  authorizeUrl: `${API_BASE_URL}/oauth/authorize`,
  logoutUrl: `${API_BASE_URL}/oauth/logout`,
  // Signup is a page on auth-service, not something this app renders. Like
  // authorize and logout, the browser NAVIGATES here — it does not fetch.
  signupUrl: `${API_BASE_URL}/signup`,
  sessionUrl: '/oauth/session',
  userinfoUrl: '/oauth/userinfo',
  // Space-delimited per RFC 6749 §3.3. `openid` alone gets you a
  // userinfo response containing nothing but `sub` — the profile claims
  // the app reads off the viewer (id, name, alias, personType) are
  // gated behind `profile`, and the address behind `email`. See
  // constants/auth for why the role-gated scopes are safe to ask for.
  scopes: AUTH.SCOPES.join(' '),
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

// The viewer arrives camelCase like every other response: the interceptor in
// api/index.js is registered on the DEFAULT axios instance and keyed on
// baseURL, so a relative request from this module is covered too.
//
// Worth saying because it is easy to assume otherwise — this module calls
// axios directly rather than going through create() — and because the rule
// hid a bug for a long time. `usertype` camel-cases to itself, being one word,
// so the claim passed through looking converted while every permission helper
// in the app read `personType`. The server sends `person_type` now and the
// conversion is real. See api/__tests__/camelCase.test.js.
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

// signup sends the browser to auth-service's signup page.
//
// A navigation rather than an XHR, for the same reason login is: the page sets
// its own CSRF-bound form and its own session cookie, on its own host.
const signup = () => {
  window.location.href = OAUTH_CONFIG.signupUrl;
};

export default {
  read,
  login,
  signup,
  exchangeCode,
  deleteItem,
};
