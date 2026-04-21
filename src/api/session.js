/* eslint-disable no-undef */
import axios from 'axios';

const OAUTH_CONFIG = {
  clientId: 'anahita-web',
  redirectUri: `${window.location.origin}/oauth/callback`,
  authorizeUrl: 'http://localhost/oauth/authorize',
  sessionUrl: '/oauth/session',
  userinfoUrl: '/oauth/userinfo',
  logoutUrl: '/oauth/logout',
  scopes: 'openid',
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

const deleteItem = () => {
  return axios.post(OAUTH_CONFIG.logoutUrl);
};

export default {
  read,
  login,
  exchangeCode,
  deleteItem,
};
