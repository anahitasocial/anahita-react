import axios from 'axios';

// The Terms of Service and Privacy Policy versions currently in force, and
// where to read each.
//
// Public and unauthenticated — the page that needs it is the signup page, and
// nobody reading that has an account yet.
//
// Raw axios rather than the shared interceptor: the response keys are `tos`,
// `privacy`, `version` and `url`, all single words, so camel-casing them would
// change nothing and going through the wrapper would only add a chance for a
// future key to be silently renamed on the way in.
function read() {
  return axios.get('/agreements');
}

export default {
  read,
};
