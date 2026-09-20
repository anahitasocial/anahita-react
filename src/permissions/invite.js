import utils from '../utils';
import meetsRoleLevel from './roleLevel';

const {
  isAdmin,
  isRegistered,
} = utils.node;

// Mirrors auth-service's permissions/invite.go and Config.MayInvite.
//
// Who may invite is a SERVER SETTING — INVITES_FROM, naming a minimum
// role of registered, administrators or super-administrators — so it
// cannot be derived from the viewer alone. It arrives through NodeInfo
// as metadata.invitesFrom, read once into the store at startup.
//
// These stay rendering hints. The server checks the same thing on every
// write and never consults these, so a stale answer costs a refusal the
// person did not expect, not a bypass.

// Browsing is self-service: the server scopes the list to the viewer on
// created_by, so this is a read of your own outbox. Any registered
// person, whatever the invite level — somebody demoted below it still
// has invitations they sent and should be able to see and revoke them.
const canBrowse = (viewer) => {
  return isRegistered(viewer) || isAdmin(viewer);
};

// Whether the viewer's role clears the level the setting names. On its own
// this answers "may somebody like you issue one", not "may one be issued".
const mayIssue = (viewer, invitesFrom) => {
  return meetsRoleLevel(viewer, invitesFrom);
};

// Two conditions, and the site-wide one first, exactly as auth-service checks
// them in handlers/invite.go: `closed` suspends invitations for everybody, so
// a super administrator on a locked-down site may not issue one either.
//
// invitationsAccepted arrives false from the empty NodeInfo document, so
// nothing offers to invite before the server has answered.
const canAdd = (viewer, { invitesFrom = '', invitationsAccepted = false } = {}) => {
  if (!invitationsAccepted) {
    return false;
  }

  return mayIssue(viewer, invitesFrom);
};

// Revoking somebody ELSE'S is moderation and stays with administrators.
// Withdrawing your own is CanDeleteOwn on the server, which admits the
// issuer — the screen only ever offers rows the viewer issued, so
// canAdd is the right question for the button.
const canDelete = (viewer) => {
  return isAdmin(viewer);
};

// Deliberately NOT gated on invitationsAccepted, and the server agrees —
// handlers/invite.go checks it before Add and nowhere else. Closing the site
// stops new invitations going out; it does not strip somebody of the ability
// to withdraw the ones already outstanding, which is the moment they most
// want to.
const canDeleteOwn = (viewer, { invitesFrom = '' } = {}) => {
  return isAdmin(viewer) || mayIssue(viewer, invitesFrom);
};

export default {
  canBrowse,
  canAdd,
  canDelete,
  canDeleteOwn,
};
