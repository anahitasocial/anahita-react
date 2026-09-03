// Bounds and character set for the username-change flow, mirroring
// requests.UsernameChangeEdit on the server (`min=3,max=32,username`).
//
// USERNAME_PATTERN is the same expression as validateUsername in
// anahita-libs/validators. Duplicated rather than inferred so the
// browser can say WHICH rule was broken — the server answers a failed
// format check with a bare 400, which on its own tells the person
// nothing about what to fix.
//
// The restriction is the impersonation guard, not tidiness: without it
// a handle could carry spaces, dots, or lookalike Unicode and read as
// somebody else's.
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 32;
const USERNAME_PATTERN = /^[a-zA-Z0-9\-_]+$/;

export default {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_PATTERN,
};
