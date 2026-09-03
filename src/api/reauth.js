/* eslint-disable no-undef */
import axios from 'axios';

import { fromBase64Url, toBase64Url } from './webauthn';

// Step-up re-authentication.
//
// These endpoints do not change anything. They prove the person is who
// the session says they are, and the server records a short-lived
// marker that the credential-mutating endpoints check. Splitting the
// proof from the mutation is what lets a passkey stand in for a
// password: a WebAuthn assertion cannot travel in a JSON body next to a
// new password, but it can be what wrote the marker a minute earlier.
//
// Callers use ../containers/auth/StepUp rather than these directly.

// Dedicated instance for the two ceremony calls, for the same reason
// api/webauthn.js has one: WebAuthn payload keys are protocol
// constants (clientDataJSON, rawId), and the global instance's
// snake_case request interceptor rewrites them into names the Go
// parser does not recognise. Instances made with axios.create inherit
// defaults but not interceptors.
const protocolClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  responseType: 'json',
});

// password re-authenticates with the current password, plus a TOTP
// passcode when the account has one enrolled.
//
// Goes through the global instance, so this is ordinary JSON with the
// usual key conversion — there is nothing protocol-shaped in it.
//
// The passcode is omitted rather than sent empty when the account has
// no TOTP: an empty string is a value the server would have to special-
// case, and an absent field says "not applicable" without ambiguity.
//
// Status codes the caller distinguishes: 401 for a wrong password, 403
// for a bad passcode, 429 for too many attempts. Split that way so the
// error lands on the field that was actually wrong.
function password({ currentPassword, totpPasscode }) {
  const payload = { password: currentPassword };

  if (totpPasscode) {
    payload.passcode = totpPasscode;
  }

  return axios.post('reauth/password', payload);
}

// passkey runs an assertion ceremony against the viewer's enrolled
// credentials.
//
// Stands alone as proof: the OS gesture guarding a passkey — a
// fingerprint, a face, a device PIN — is already a second factor, so
// there is no passcode step after it.
//
// Returns nothing deliberately, matching webauthn.register. The
// /finish response comes back through protocolClient, which has no
// response interceptor, so its keys are still snake_case; handing that
// to a caller that expects camelCase everywhere else invites a subtle
// bug. Success is the absence of a throw.
//
// Throws on failure. A cancelled or dismissed OS prompt surfaces as
// NotAllowedError, which the caller treats as "changed their mind"
// rather than an error worth showing.
const passkey = async () => {
  const { data: options } = await protocolClient.post('reauth/passkey/begin');

  const publicKey = {
    ...options.publicKey,
    challenge: fromBase64Url(options.publicKey.challenge),
  };

  // Scopes the prompt to this person's credentials. Absent on a
  // discoverable-credential flow, hence the guard.
  if (publicKey.allowCredentials) {
    publicKey.allowCredentials = publicKey.allowCredentials.map((item) => {
      return {
        ...item,
        id: fromBase64Url(item.id),
      };
    });
  }

  const assertion = await navigator.credentials.get({ publicKey });

  if (!assertion) {
    throw new Error('No passkey was used.');
  }

  const payload = {
    id: assertion.id,
    rawId: toBase64Url(assertion.rawId),
    type: assertion.type,
    response: {
      clientDataJSON: toBase64Url(assertion.response.clientDataJSON),
      authenticatorData: toBase64Url(assertion.response.authenticatorData),
      signature: toBase64Url(assertion.response.signature),
      // Null for a non-discoverable credential, where the server
      // already knows who is asking from the session.
      userHandle: assertion.response.userHandle
        ? toBase64Url(assertion.response.userHandle)
        : null,
    },
    clientExtensionResults: assertion.getClientExtensionResults
      ? assertion.getClientExtensionResults()
      : {},
  };

  await protocolClient.post('reauth/passkey/finish', payload);
};

export default {
  password,
  passkey,
};
