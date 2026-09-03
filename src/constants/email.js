// Bounds for the email-change flow, mirroring requests.EmailChangeEdit
// and requests.EmailChangeConfirm on the server (`min=10,max=100`).
//
// Deliberately NOT Person.FIELDS.EMAIL, which is 10-80 and shared with
// signup — whose server-side bound is a different number again
// (requests.Signup caps at 64). One shared constant cannot be right for
// three endpoints that validate differently, and reusing it here meant
// a 90-character address was rejected in the browser with "Enter a valid
// email address" for no reason the person could see.
//
// These exist to save a round trip, not to be the rule: the server
// validates independently and stays the source of truth.
const EMAIL_MIN_LENGTH = 10;
const EMAIL_MAX_LENGTH = 100;

export default {
  EMAIL_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
};
