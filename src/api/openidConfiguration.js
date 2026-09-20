import publicClient from './publicClient';

// What this server says it supports, from the OIDC discovery document.
//
// The client form asks for it so the grant-type and scope pickers are
// populated by the server rather than by a constants file in the
// browser. Both lists are validated server-side on every add and edit —
// grant_types against a `oneof` tag, scopes against the catalog in
// anahita-libs/constants — so a hard-coded copy here is a copy that can
// only ever drift out of date, and it did: the form this replaces
// offered a `password` grant that auth-service has never accepted.
//
// Keys arrive camelCased by the response interceptor, so the fields are
// scopesSupported and grantTypesSupported rather than the snake_case
// names in the published document.

const read = () => {
  return publicClient.get('/.well-known/openid-configuration');
};

export default {
  read,
};
