import axios from 'axios';

// OAuth client registrations. Super-admin only, and every write
// additionally needs TOTP enrolled on the viewer's account — see
// auth-service's permissions/oauth.go, which ends CanAdd, CanEdit and
// CanDelete with `if !viewer.TotpEnabled`.
//
// Envelopes follow the house rule: browse answers { data: [...] },
// everything else answers the client bare. Same split as person-service
// and as actions/create.js expects. Nothing here needs a
// `data.data || data` fallback, and adding one would only hide the day
// the server changes its mind.

const browse = () => {
  return axios.get('/clients');
};

const read = (id) => {
  return axios.get(`/clients/${id}`);
};

// The response to this carries `clientSecret` — the ONLY time it is ever
// sent. The server hashes it before storing and has no way to produce it
// again; a caller that drops it has locked the operator out of their own
// client and left rotation as the only way back.
//
// Public (non-confidential) clients get no secret at all. PKCE proves
// their identity at /token instead, so the field is simply absent rather
// than empty.
const add = (client) => {
  return axios.post('/clients', client);
};

// clientId is immutable and not sent. The server reads the id from the
// path and ignores a client_id in the body, so including it would look
// like a rename that silently did nothing.
const edit = (client) => {
  return axios.patch(`/clients/${client.id}`, {
    name: client.name,
    redirectUris: client.redirectUris,
    grantTypes: client.grantTypes,
    scopes: client.scopes,
    tokenExpiry: client.tokenExpiry,
    confidential: client.confidential,
    skipConsent: client.skipConsent,
    active: client.active,
  });
};

const deleteItem = (id) => {
  return axios.delete(`/clients/${id}`);
};

// Mints a fresh secret and revokes every outstanding refresh token for
// the client, because the old secret is now assumed compromised. Like
// add, the plaintext comes back exactly once.
//
// Refused with 400 for a public client: there is no secret to rotate.
const rotateSecret = (id) => {
  return axios.post(`/clients/${id}/rotate-secret`);
};

export default {
  browse,
  read,
  add,
  edit,
  deleteItem,
  rotateSecret,
};
