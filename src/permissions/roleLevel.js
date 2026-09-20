import PERSON from '../constants/person';

const { USERTYPE } = PERSON.FIELDS;

// A minimum role, as an operator sets it on the server.
//
// Mirrors anahita-libs/constants/role_levels.go. Two settings use this scale
// and arrive through NodeInfo: INVITES_FROM as metadata.invitesFrom, and
// GROUPS_FROM as metadata.groupsFrom. They share the scale here for the same
// reason they share it there — so the two cannot drift apart.
//
// These stay rendering hints. The server checks the same thing on every write
// and never consults these, so a stale answer costs a refusal the person did
// not expect, not a bypass.

// Two scales that fail in OPPOSITE directions, as on the server.
//
// An unknown ROLE ranks below everything, so nobody is admitted by a person
// type this build does not know. An unknown LEVEL ranks above everything, so
// a level from a newer server — or a NodeInfo document that never arrived —
// hides the controls rather than offering them.
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

// Each level is the plural of an Anahita person type, which is what makes a
// role rankable against a setting. There are four types — guest, registered,
// administrator, super-administrator — and no level here names anything else.
const levelRank = (level) => {
  switch (level) {
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

// Compared by RANK, never by equality, and never with an administrator
// shortcut above it. A check that opens with "administrators always may"
// bypasses the setting, which would make `super-administrators` a level that
// does nothing.
const meetsRoleLevel = (viewer, level) => {
  return roleRank(viewer) >= levelRank(level);
};

export default meetsRoleLevel;
