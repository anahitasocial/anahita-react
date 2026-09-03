import async from './async';

const password = async('password');

// PASSWORD_MIN_LENGTH / PASSWORD_MAX_LENGTH mirror the server's
// validation on requests.PasswordEdit and requests.PasswordReset
// (`min=15,max=150`). They live here rather than under FIELDS because
// both the change-password container and its form destructure them
// straight off this export.
//
// Fifteen, not the eight in constants/person.js FIELDS.PASSWORD. That
// value belongs to the older signup path and is NOT the rule the
// change-password endpoint enforces — reusing it here would let the
// form accept a password the server then rejects with a 400 that lands
// on no field in particular.
//
// Keep these in step with the Go request structs. They exist to save a
// round-trip, not to be the rule: the server validates independently
// and stays the source of truth.
const PASSWORD_MIN_LENGTH = 15;
const PASSWORD_MAX_LENGTH = 150;

export default {
  RESET: password('reset'),
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  FIELDS: {
    EMAIL: {
      MAX_LENGTH: 80,
      MIN_LENGTH: 8,
    },
    PASSWORD: {
      MIN_LENGTH: PASSWORD_MIN_LENGTH,
      MAX_LENGTH: PASSWORD_MAX_LENGTH,
    },
  },
};
