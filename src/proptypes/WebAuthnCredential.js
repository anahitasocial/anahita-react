import PropTypes from 'prop-types';

// Shape of one enrolled passkey as returned by
// GET /webauthn/credentials. Mirrors
// responses.WebAuthnCredentialItem on the Go side.
export default PropTypes.shape({
  id: PropTypes.number.isRequired,
  nickname: PropTypes.string.isRequired,
  // "internal" (built-in sensor), "hybrid" (phone over QR + BLE),
  // "usb", "nfc", "ble".
  transports: PropTypes.arrayOf(PropTypes.string),
  // True when the passkey is backed up to a cloud keychain and so
  // survives losing the device it was made on.
  synced: PropTypes.bool,
  // Set when an assertion arrived with a signature counter at or below
  // the stored value — a possible cloned authenticator. Recorded, not
  // enforced, so the person is the one who decides whether to revoke.
  cloneWarning: PropTypes.bool,
  lastUsedAt: PropTypes.string,
  createdAt: PropTypes.string,
});
