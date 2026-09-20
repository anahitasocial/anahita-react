/* eslint-env jest */
import invite from '../invite';

// Who may issue an invitation, mirroring auth-service.
//
// Two independent conditions, and the client has to agree with the server on
// both or it offers a control the server refuses:
//
//   handlers/invite.go   refuses every Add while registration is `closed`
//   Config.MayInvite     compares the viewer's role against INVITES_FROM
//
// These are rendering hints — the server checks the same things on every
// write — so a wrong answer here costs somebody a refusal they did not
// expect, never a way in. That is still worth getting right.

const person = (personType) => {
  return { id: 1, personType };
};

const GUEST = person('guest');
const REGISTERED = person('registered');
const ADMIN = person('administrator');
const SUPER_ADMIN = person('super-administrator');

const open = (invitesFrom) => {
  return { invitationsAccepted: true, invitesFrom };
};

describe('invite.canAdd', () => {
  // The site-wide switch, checked first and on its own. `closed` suspends
  // invitations for everybody — there is no role that outranks it.
  it('refuses everybody while the site is not accepting invitations', () => {
    [GUEST, REGISTERED, ADMIN, SUPER_ADMIN].forEach((viewer) => {
      expect(invite.canAdd(viewer, {
        invitationsAccepted: false,
        invitesFrom: 'registered',
      })).toBe(false);
    });
  });

  it('admits from the named level upwards', () => {
    expect(invite.canAdd(REGISTERED, open('registered'))).toBe(true);
    expect(invite.canAdd(ADMIN, open('registered'))).toBe(true);
    expect(invite.canAdd(SUPER_ADMIN, open('registered'))).toBe(true);

    expect(invite.canAdd(REGISTERED, open('administrators'))).toBe(false);
    expect(invite.canAdd(ADMIN, open('administrators'))).toBe(true);

    expect(invite.canAdd(ADMIN, open('super-administrators'))).toBe(false);
    expect(invite.canAdd(SUPER_ADMIN, open('super-administrators'))).toBe(true);
  });

  // A guest is not a person type any level names, and the lowest level is
  // `registered`. Nobody signed out invites anybody.
  it('never admits a guest', () => {
    ['registered', 'administrators', 'super-administrators'].forEach((level) => {
      expect(invite.canAdd(GUEST, open(level))).toBe(false);
    });
  });

  // The two unknowns fail in OPPOSITE directions, which is the whole point of
  // the two scales: an unrecognised LEVEL — a newer server, or a NodeInfo
  // document that never arrived — hides the control rather than offering it.
  it('refuses when the level is unknown, empty or missing', () => {
    expect(invite.canAdd(SUPER_ADMIN, open('members'))).toBe(false);
    expect(invite.canAdd(SUPER_ADMIN, open(''))).toBe(false);
    expect(invite.canAdd(SUPER_ADMIN, { invitationsAccepted: true })).toBe(false);
  });

  // Called before NodeInfo answers, or against a viewer that is not there.
  it('refuses rather than throwing when nothing is known', () => {
    expect(invite.canAdd(SUPER_ADMIN)).toBe(false);
    expect(invite.canAdd(SUPER_ADMIN, {})).toBe(false);
    expect(invite.canAdd(null, open('registered'))).toBe(false);
    expect(invite.canAdd(undefined)).toBe(false);
  });
});

describe('invite.canDeleteOwn', () => {
  // Closing the site stops new invitations going out. It does not strip
  // somebody of the ability to withdraw the ones already outstanding — which
  // is the moment they most want to — and the server agrees: invite.go checks
  // AllowsInvitations before Add and nowhere else.
  it('still allows withdrawing while the site is closed', () => {
    const closed = { invitationsAccepted: false, invitesFrom: 'registered' };

    expect(invite.canAdd(REGISTERED, closed)).toBe(false);
    expect(invite.canDeleteOwn(REGISTERED, closed)).toBe(true);
  });

  // Revoking somebody else's is moderation, so an administrator keeps it
  // whatever the level says.
  it('keeps administrators able to revoke below their level', () => {
    expect(invite.canDeleteOwn(ADMIN, { invitesFrom: 'super-administrators' })).toBe(true);
    expect(invite.canDeleteOwn(REGISTERED, { invitesFrom: 'super-administrators' })).toBe(false);
  });
});
