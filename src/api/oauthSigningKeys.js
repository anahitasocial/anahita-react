import axios from 'axios';
import publicClient from './publicClient';

// The keys that sign every access and ID token this site issues.
//
// Browse, read and toggle only — there is deliberately no add or
// delete. Keys are provisioned at deploy time by SeedKMSSigningKey and
// retired by DeleteExpired; auth-service exposes no route for either,
// so offering a button for them would be a lie.
//
// No key material comes back from these endpoints. Both PEM fields on
// the entity carry `json:"-"`, and the read handler zeroes PrivateKey a
// second time before writing the response. The PUBLIC half is published
// at /.well-known/jwks.json instead, which is where jwks() below reads
// it from.

const browse = () => {
  return axios.get('/oauth-signing-keys');
};

const read = (kid) => {
  return axios.get(`/oauth-signing-keys/${encodeURIComponent(kid)}`);
};

// The only mutable field. Deactivating the last active key is refused
// with 409 `last_active_key` — with no active key the server cannot
// sign anything and every sign-in on the site stops.
const edit = (kid, active) => {
  return axios.patch(`/oauth-signing-keys/${encodeURIComponent(kid)}`, { active });
};

// What verifiers actually see. Public, unauthenticated, and the real
// answer to "is this key in use?" — a key can be marked active in the
// registry and still be absent here, or linger here after being
// switched off, depending on when consumers last refreshed their cache.
//
// Read alongside browse so a kid can be shown as published or not,
// rather than reporting the registry's opinion as fact.
const jwks = () => {
  return publicClient.get('/.well-known/jwks.json');
};

export default {
  browse,
  read,
  edit,
  jwks,
};
