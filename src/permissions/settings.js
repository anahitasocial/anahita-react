import utils from '../utils';

const {
  isSuperAdmin,
} = utils.node;

// Site settings: what this installation is, and the OAuth registries
// that decide who can authenticate against it.
//
// Super admin, and only super admin. auth-service checks IsSuperAdmin
// on all eight OAuth methods, and the oauth:read and oauth:write scopes
// that carry them are SuperAdminOnly at token-mint time — an
// administrator's token does not hold them at all.
//
// The approval queue and the invitation list are NOT here, and that is
// why. Both are gated server-side on IsAdminOrSuperAdmin, so keeping
// them behind this predicate would have locked administrators out of
// permissions they hold. They have their own pages and their own
// predicates; see permissions/signupRequest.js and permissions/invite.js.
// One predicate, not two. This replaces a canEdit that the left menu
// called to decide whether to SHOW the link — a read question answered
// by a write permission, which happened to give the right answer only
// because both are super admin. Opening the area and changing things
// in it are the same privilege here, so there is one name for it.
const canBrowse = (viewer) => {
  return isSuperAdmin(viewer);
};

export default {
  canBrowse,
};
