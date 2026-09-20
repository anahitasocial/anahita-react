import {
  shape,
  number,
  string,
  arrayOf,
  bool,
} from 'prop-types';

// Matches responses.OAuthClientItem in auth-service.
//
// createTime and updateTime used to be here and never existed: the
// server sends created_at, which arrives as createdAt, and has no
// updated field at all. The clients table read client.createTime and
// rendered `new Date(undefined)` — "Invalid Date" in every row.
//
// clientSecret is separate rather than optional here. It is on exactly
// two responses, add and rotate-secret, and folding it into the shape
// every list row is checked against would suggest a row might carry one.
export default shape({
  id: number,
  clientId: string,
  name: string,
  redirectUris: arrayOf(string),
  grantTypes: arrayOf(string),
  scopes: arrayOf(string),
  tokenExpiry: number,
  confidential: bool,
  skipConsent: bool,
  // Always true. The handler assigns it unconditionally on both add and
  // edit, ignoring whatever was sent, so it is reported and never asked
  // for. Third-party registration is not a thing this server does yet.
  firstParty: bool,
  active: bool,
  createdAt: string,
});
