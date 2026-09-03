import axios from 'axios';

// Availability checks.
//
// Both endpoints answer 200 when the value is already registered and
// 404 when it is free — the opposite of what the call sites expect.
// Callers treat a *rejected* promise as "taken" (see the .catch handlers
// in the signup and account-settings forms), so the inversion is done
// here rather than at every call site.
//
// Anything other than a clean 404 rejects too: if the check itself is
// broken we would rather block a signup than wave through a duplicate.
const availability = (request) => {
  return request.then(
    () => {
      // 200 — the value exists already.
      return Promise.reject(new Error('taken'));
    },
    (error) => {
      if (error.response && error.response.status === 404) {
        return { available: true };
      }
      return Promise.reject(error);
    },
  );
};

function email(value) {
  return availability(axios.get('/auth/is/email', { params: { email: value } }));
}

// totp reports whether an account has TOTP enrolled, by email.
//
// Not wrapped in `availability`: that helper inverts 200/404 into
// taken/free for the signup checks, and this question has no such
// polarity — 200 means enrolled, 404 means not. Returning a boolean
// keeps the inversion out of the call sites.
//
// Unauthenticated, because the login page has to know whether to ask
// for a passcode before a session exists. Behind a session, use
// totp.read instead: it takes no identifier and so cannot be used to
// ask about anybody else.
function totp(value) {
  return axios.get('/auth/is/totp', { params: { email: value } })
    .then(() => {
      return true;
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        return false;
      }
      return Promise.reject(error);
    });
}

function username(value) {
  return availability(axios.get(`/people/${encodeURIComponent(value)}`));
}

export default {
  email,
  totp,
  username,
};
