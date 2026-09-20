import utils from '../utils';
import PERSON from '../constants/person';

const {
  isAdmin,
  isRegistered,
} = utils.node;

const { USERTYPE } = PERSON.FIELDS;

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

// Two scales that fail in OPPOSITE directions, as on the server.
//
// An unknown ROLE ranks below everything, so nobody is admitted by a
// person type this build does not know. An unknown LEVEL ranks above
// everything, so a level from a newer server — or a NodeInfo document
// that never arrived — hides the controls rather than offering them.
const roleRank = (viewer) => {
  if (!viewer) {
    return 0;
  }

  switch (viewer.personType) {
    case USERTYPE.REGISTERED:
      return 1;
    case USERTYPE.ADMIN:
      return 2;
    case USERTYPE.SUPER_ADMIN:
      return 3;
    default:
      return 0;
  }
};

// Each level is the plural of an Anahita person type, which is what
// makes a role rankable against a setting. There are four types —
// guest, registered, administrator, super-administrator — and no level
// here names anything else. A `members` value was accepted briefly; it
// is gone from the server, and adding it back here would mean the
// client honoured a level the server refuses to start with.
const levelRank = (invitesFrom) => {
  switch (invitesFrom) {
    case 'registered':
      return 1;
    case 'administrators':
      return 2;
    case 'super-administrators':
      return 3;
    default:
      return Infinity;
  }
};

// Browsing is self-service: the server scopes the list to the viewer on
// created_by, so this is a read of your own outbox. Any registered
// person, whatever the invite level — somebody demoted below it still
// has invitations they sent and should be able to see and revoke them.
const canBrowse = (viewer) => {
  return isRegistered(viewer) || isAdmin(viewer);
};

const canAdd = (viewer, invitesFrom) => {
  return roleRank(viewer) >= levelRank(invitesFrom);
};

// Revoking somebody ELSE'S is moderation and stays with administrators.
// Withdrawing your own is CanDeleteOwn on the server, which admits the
// issuer — the screen only ever offers rows the viewer issued, so
// canAdd is the right question for the button.
const canDelete = (viewer) => {
  return isAdmin(viewer);
};

const canDeleteOwn = (viewer, invitesFrom) => {
  return isAdmin(viewer) || canAdd(viewer, invitesFrom);
};

export default {
  canBrowse,
  canAdd,
  canDelete,
  canDeleteOwn,
};
