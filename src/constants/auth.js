export default {
  VIEWER_STORAGE_KEY: 'anahita-viewer',
  // Scopes requested at /oauth/authorize. Must stay a subset of the
  // scopes registered for the `anahita-web` client in auth-service
  // (auth-defaults/oauth_seed_clients.json) — authorize rejects the
  // whole request with invalid_scope on any scope the client isn't
  // registered for.
  //
  // `oauth:read`/`oauth:write` are super-admin-only, and requesting
  // them from an ordinary viewer is still safe: the authorize handler
  // intersects the request with what the viewer may actually grant and
  // silently drops the rest, so a regular user gets a narrower token
  // rather than an error. No scope is admin-only — role authority is
  // enforced separately, in each service's permission checks.
  SCOPES: [
    'openid',
    'profile',
    'email',
    'offline_access',
    'actors:read',
    'actors:write',
    'media:read',
    'media:write',
    'comments:write',
    'likes:write',
    'socialgraph:read',
    'socialgraph:write',
    'notifications:read',
    'notifications:write',
    'taxonomy:write',
    'account:read',
    'account:write',
    'oauth:read',
    'oauth:write',
  ],
  FIELDS: {
    IDENTIFIER: {
      MAX_LENGTH: 100,
      MIN_LENGTH: 10,
    },
    PASSWORD: {
      MAX_LENGTH: 100,
      MIN_LENGTH: 10,
    },
  },
};
