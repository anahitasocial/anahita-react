import axios from 'axios';
import utils from '../utils';

const { constructFormData } = utils.api;

// read reports whether the viewer has TOTP enrolled, and whether that
// enrolment has aged out: { data: { enabled, expired } }.
//
// The viewer's own status only — the endpoint takes no identifier, so
// there is nothing to pass. Use is.totp for the unauthenticated
// login-page check, which is keyed by email.
//
// Path is 'totp', no trailing slash. The route is registered literally
// and 'totp/' answers 404; nginx is equally literal about it.
function read() {
  return axios.get('totp');
}

function edit() {
  return axios.patch('totp');
}

// The QR code comes back as a PNG, so this one call needs a blob
// response. It is set per-request rather than on axios.defaults:
// mutating the global default leaked 'blob' into every subsequent call
// whenever this request failed (a wrong password, the common case), and
// the rest of the app then received Blobs where it expected parsed
// JSON. api/webauthn.js documents working around exactly that.
function add(password) {
  return axios.post('totp', constructFormData({
    password,
  }), { responseType: 'blob' });
}

// skipAuthRedirect: a wrong passcode here is a failed check, not a dead
// session. Without the flag the global 401/refresh interceptor would
// treat any auth-shaped failure as session expiry and bounce the user
// out of the enrolment wizard. The server returns 403 for this now, so
// the flag is belt-and-braces.
function addRecoveryCodes(passcode) {
  return axios.post('totp/recoverycodes', constructFormData({
    passcode,
  }), { skipAuthRedirect: true });
}

function deleteItem(person) {
  return axios.delete(`totp/${person.id}`);
}

function isExpired() {
  return axios.get('totp/is/expired');
}

function verify(passcode) {
  return axios.post('totp/verify', constructFormData({
    passcode,
  }), { skipAuthRedirect: true });
}

export default {
  read,
  edit,
  add,
  addRecoveryCodes,
  deleteItem,
  isExpired,
  verify,
};
