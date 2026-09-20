import {
  shape,
  number,
  string,
  bool,
} from 'prop-types';

// Matches entities.OAuthSigningKey as it is serialised for the admin
// endpoints. The Go struct already tags these camelCase, so unlike the
// client shape nothing is renamed on the way through.
//
// There is no publicKey or privateKey. Both carry `json:"-"`, and the
// read handler blanks PrivateKey again before writing the response.
// The public half is published at /.well-known/jwks.json instead, keyed
// by the same kid — see OAuthSigningKeys and the api module.
//
// backend is 'local' or a KMS identifier: where the private half
// actually lives, which is the difference between a key this process
// holds and one it can only ask to sign.
export default shape({
  id: number,
  keyId: string,
  algorithm: string,
  active: bool,
  expiresAt: string,
  createdAt: string,
  backend: string,
});
