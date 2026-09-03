/* eslint-disable no-undef */
import axios from 'axios';

// Dedicated axios instance for the two ceremony calls.
//
// WebAuthn payload keys are protocol constants, not our naming:
// clientDataJSON, attestationObject, rawId. The global instance's
// camelCase/snake_case interceptors rewrite them to client_data_json
// and friends, and the Go library's parser then fails with an error
// that points nowhere near the real cause.
//
// Instances made with axios.create() inherit defaults but NOT
// interceptors, which is exactly the escape hatch we want. Auth still
// works — the BFF authenticates by cookie (nginx auth_request turns it
// into a JWT upstream), so there is no Authorization header to attach.
//
// responseType is pinned defensively. It used to be load-bearing:
// api/totp.js flipped axios.defaults.responseType to 'blob' for the QR
// code and never reset it, so anything running after TOTP setup got a
// Blob instead of parsed JSON. totp.js now sets that per-request, but
// pinning it here keeps this client independent of the global default.
const protocolClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  responseType: 'json',
});

// --- base64url <-> ArrayBuffer -------------------------------------
//
// WebAuthn speaks ArrayBuffers; JSON does not. Every binary field is
// base64url over the wire and has to be converted at both boundaries.
// Hand-rolled rather than pulling in @simplewebauthn/browser, matching
// how api/auth.js hand-rolls the PKCE challenge with crypto.subtle —
// same amount of code, one fewer dependency to track.

const fromBase64Url = (value) => {
  let padded = value.replace(/-/g, '+').replace(/\//g, '/').replace(/_/g, '/');
  while (padded.length % 4) {
    padded += '=';
  }
  const binary = window.atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const toBase64Url = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// --- capability checks ---------------------------------------------

// isSupported reports whether this browser can run a ceremony at all.
//
// The secure-context check is the one that catches people out in dev:
// WebAuthn is available on http://localhost but not on an http://
// LAN address, so testing from a phone pointed at a dev machine fails
// here rather than at the prompt.
const isSupported = () => {
  return Boolean(
    window.PublicKeyCredential &&
    navigator.credentials &&
    navigator.credentials.create &&
    window.isSecureContext,
  );
};

// hasPlatformAuthenticator reports whether this device has a built-in
// authenticator — Touch ID, Windows Hello, an Android sensor.
//
// False does not mean passkeys are unavailable: a security key or a
// phone over hybrid transport still works. Used only to pick the
// wording on the empty state, never to gate the button.
const hasPlatformAuthenticator = () => {
  if (!isSupported() ||
      !window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
    return Promise.resolve(false);
  }
  return window.PublicKeyCredential
    .isUserVerifyingPlatformAuthenticatorAvailable()
    .catch(() => {
      return false;
    });
};

// --- credential management -----------------------------------------

// browse lists the viewer's enrolled passkeys. Goes through the global
// axios instance so the response arrives camelCased like everything
// else in the app.
function browse() {
  return axios.get('webauthn/credentials');
}

function edit(id, nickname) {
  return axios.patch(`webauthn/credentials/${id}`, { nickname });
}

function deleteItem(id) {
  return axios.delete(`webauthn/credentials/${id}`);
}

// --- registration ceremony -----------------------------------------

// register runs the full enrolment: fetch options, prompt the
// authenticator, submit the attestation.
//
// Takes no name. The person is not asked for one, because until the
// browser prompt resolves neither they nor we know what is being
// enrolled — the options range from "Touch ID" to "iCloud Keychain" to
// "Your Chrome Profile", and nobody guesses that in advance. The
// server derives a name from the authenticator's own identifiers once
// the ceremony finishes, and the person renames it after if they want.
//
// Deliberately returns nothing. The /finish response comes back
// through protocolClient, which has no response interceptor, so its
// keys are still snake_case — handing that to a component that expects
// camelCase everywhere else invites a subtle bug. The caller re-runs
// browse() instead, which is one cheap request for a consistent shape.
//
// Throws on failure. A cancelled OS prompt surfaces as NotAllowedError;
// an authenticator already enrolled surfaces as InvalidStateError.
// Both are handled by the caller, not here.
const register = async () => {
  const { data: options } = await protocolClient.post(
    'webauthn/credentials/register/begin',
  );

  const publicKey = {
    ...options.publicKey,
    challenge: fromBase64Url(options.publicKey.challenge),
    user: {
      ...options.publicKey.user,
      id: fromBase64Url(options.publicKey.user.id),
    },
  };

  // Sent by the server so the browser refuses to enrol an
  // authenticator this person already has — otherwise they end up with
  // two identical-looking entries and no way to tell them apart.
  if (publicKey.excludeCredentials) {
    publicKey.excludeCredentials = publicKey.excludeCredentials.map((item) => {
      return {
        ...item,
        id: fromBase64Url(item.id),
      };
    });
  }

  const credential = await navigator.credentials.create({ publicKey });

  if (!credential) {
    throw new Error('No passkey was created.');
  }

  const payload = {
    id: credential.id,
    rawId: toBase64Url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: toBase64Url(credential.response.clientDataJSON),
      attestationObject: toBase64Url(credential.response.attestationObject),
      // Transport hints let the browser reach this authenticator
      // directly next time instead of asking the person to pick.
      transports: credential.response.getTransports ?
        credential.response.getTransports() :
        [],
    },
    clientExtensionResults: credential.getClientExtensionResults ?
      credential.getClientExtensionResults() :
      {},
  };

  await protocolClient.post('webauthn/credentials/register/finish', payload);
};

// Named exports so api/reauth.js can run an assertion ceremony without
// a second copy of the base64url conversions. One implementation, so a
// fix to the padding logic cannot land in one ceremony and miss the
// other.
export { fromBase64Url, toBase64Url };

export default {
  browse,
  edit,
  deleteItem,
  register,
  isSupported,
  hasPlatformAuthenticator,
};
