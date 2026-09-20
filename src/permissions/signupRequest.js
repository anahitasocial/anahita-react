import utils from '../utils';

const {
  isAdmin,
} = utils.node;

// Mirrors the queue's server-side gates, which are auth-service's
// Perms.Invite reused: Browse -> CanBrowse, Approve -> CanAdd,
// Reject -> CanDelete. All three test IsAdminOrSuperAdmin.
//
// Administrator, not super admin. Deciding who joins is ordinary
// moderation and the back end treats it that way.
//
// No TOTP gate on any of these, unlike the OAuth tabs — approving a
// signup creates one ordinary account, where an OAuth write can hand
// somebody the identity provider.

const canBrowse = (viewer) => {
  return isAdmin(viewer);
};

const canApprove = (viewer) => {
  return isAdmin(viewer);
};

const canReject = (viewer) => {
  return isAdmin(viewer);
};

export default {
  canBrowse,
  canApprove,
  canReject,
};
