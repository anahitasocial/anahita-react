import utils from '../utils';

const {
  isSuperAdmin,
} = utils.node;

// Mirrors auth-service's permissions/oauth_signing_key.go.
//
// There is no canAdd or canDelete, and their absence is the point:
// auth-service exposes no route for either. Keys are seeded at deploy
// time and retired by DeleteExpired, so a client that offered the
// buttons would be promising something the server cannot do.
//
// Note what is NOT checked here. Editing a key also requires TOTP on
// the viewer's account server-side. That is deliberately not folded
// into canEdit: these predicates answer "is this person the right
// person", which is a property of the viewer's role, while TOTP is a
// property of how they are enrolled and is fixable in a minute without
// anybody's permission changing. Conflating them would tell a super
// admin they are not allowed to do something they are perfectly
// allowed to do. The settings container asks about TOTP separately and
// says which of the two is missing.

const canBrowse = (viewer) => {
  return isSuperAdmin(viewer);
};

const canRead = (viewer) => {
  return isSuperAdmin(viewer);
};

const canEdit = (viewer) => {
  return isSuperAdmin(viewer);
};

export default {
  canBrowse,
  canRead,
  canEdit,
};
