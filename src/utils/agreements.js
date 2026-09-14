import legal from '../statics/legal';

// Whether a viewer has to accept the legal documents again.
//
// The version in force for each document lives in statics/legal/index.js.
// The version a viewer accepted arrives on the session, from /oauth/userinfo.
// Anybody behind on either is sent to the agreements page.

// compareVersions reports -1, 0 or 1 as `a` is behind, equal to, or ahead of
// `b`, comparing dotted numbers part by part.
//
// Numerically, not as strings. As strings "1.10.0" sorts before "1.9.0", which
// would stop asking people to accept once a version reached double digits in
// any part. A missing part is zero, so "1.0" and "1.0.0" are the same version.
const compareVersions = (a, b) => {
  const left = String(a || '').split('.');
  const right = String(b || '').split('.');
  const length = Math.max(left.length, right.length);

  for (let i = 0; i < length; i += 1) {
    const l = parseInt(left[i], 10) || 0;
    const r = parseInt(right[i], 10) || 0;

    if (l > r) return 1;
    if (l < r) return -1;
  }

  return 0;
};

// needsAcceptance reports whether one document has to be accepted again.
//
// True when nothing is on record, and when the version in force is AHEAD of the
// one accepted. Only ahead: a rollback — the version in force moving
// backwards — is not a new document, and asking everybody to re-accept text
// they have already accepted would teach them to click through it.
const needsAcceptance = (agreement, current) => {
  if (!agreement || !agreement.accepted || !agreement.version) {
    return true;
  }

  return compareVersions(current, agreement.version) > 0;
};

const hasOutdatedTos = (viewer) => {
  return needsAcceptance(viewer && viewer.tosAgreement, legal.tos.version);
};

const hasOutdatedPrivacy = (viewer) => {
  return needsAcceptance(viewer && viewer.privacyAgreement, legal.privacy.version);
};

const hasOutdatedTerms = (viewer) => {
  return hasOutdatedTos(viewer) || hasOutdatedPrivacy(viewer);
};

export default {
  compareVersions,
  needsAcceptance,
  hasOutdatedTos,
  hasOutdatedPrivacy,
  hasOutdatedTerms,
};
