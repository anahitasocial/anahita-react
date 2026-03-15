/* eslint-disable no-undef */
import axios from 'axios';

const OAUTH_CONFIG = {
  clientId: 'anahita-web',
  redirectUri: `${window.location.origin}/oauth/callback`,
  authorizeUrl: 'http://localhost/oauth/authorize',
  tokenUrl: '/oauth/token',
  userinfoUrl: '/oauth/userinfo',
  scopes: 'openid profile email',
};

// Generate random string for state and PKCE
const generateRandom = (length = 43) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Generate PKCE code challenge from verifier
const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Redirect to auth-service login
const login = async () => {
  const state = generateRandom(32);
  const codeVerifier = generateRandom(43);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store for callback verification
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

// Exchange authorization code for tokens
const exchangeCode = (code) => {
  const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
  sessionStorage.removeItem('oauth_state');
  sessionStorage.removeItem('oauth_code_verifier');

  return axios.post(OAUTH_CONFIG.tokenUrl,
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

// Refresh access token
const refresh = (refreshToken) => {
  return axios.post(OAUTH_CONFIG.tokenUrl,
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: OAUTH_CONFIG.clientId,
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
};

// Revoke token on logout
const deleteItem = () => {
  const refreshToken = sessionStorage.getItem('refresh_token');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');

  if (refreshToken) {
    return axios.post('/oauth/revoke',
      new URLSearchParams({
        token: refreshToken,
        token_type_hint: 'refresh_token',
        client_id: OAUTH_CONFIG.clientId,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
  }

  return Promise.resolve();
};

export default {
  read,
  login,
  exchangeCode,
  refresh,
  deleteItem,
};
