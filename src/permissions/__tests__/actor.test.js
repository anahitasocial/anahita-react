/* eslint-env jest */
import actor from '../actor';

// Who may create a group.
//
// Mirrors group-service's Config.MayCreateGroup and anahita-libs
// ActorsPermissions.CanAdd, which is the one that actually decides. These are
// rendering hints: wrong here costs a refusal somebody did not expect, never a
// way in. The point of the tests is that the hint agrees with the gate.

const person = (personType) => {
  return { id: 1, personType };
};

const GUEST = person('guest');
const REGISTERED = person('registered');
const ADMIN = person('administrator');
const SUPER_ADMIN = person('super-administrator');

describe('actor.canAdd', () => {
  it('admits from the configured level upwards', () => {
    expect(actor.canAdd(REGISTERED, { groupsFrom: 'registered' })).toBe(true);
    expect(actor.canAdd(ADMIN, { groupsFrom: 'registered' })).toBe(true);
    expect(actor.canAdd(SUPER_ADMIN, { groupsFrom: 'registered' })).toBe(true);

    expect(actor.canAdd(REGISTERED, { groupsFrom: 'administrators' })).toBe(false);
    expect(actor.canAdd(ADMIN, { groupsFrom: 'administrators' })).toBe(true);
  });

  // The case the setting exists for. An administrator shortcut — which is what
  // this permission used to be, a bare isAdmin — would make this level do
  // nothing at all.
  it('excludes ordinary administrators under super-administrators', () => {
    expect(actor.canAdd(ADMIN, { groupsFrom: 'super-administrators' })).toBe(false);
    expect(actor.canAdd(SUPER_ADMIN, { groupsFrom: 'super-administrators' })).toBe(true);
  });

  it('never admits a guest', () => {
    ['registered', 'administrators', 'super-administrators'].forEach((level) => {
      expect(actor.canAdd(GUEST, { groupsFrom: level })).toBe(false);
    });
  });

  // Before NodeInfo answers there is no level, and an absent level ranks above
  // every role — so the + arrives with the document rather than flashing for
  // somebody who turns out not to qualify.
  it('refuses until the level is known', () => {
    expect(actor.canAdd(SUPER_ADMIN, {})).toBe(false);
    expect(actor.canAdd(SUPER_ADMIN)).toBe(false);
    expect(actor.canAdd(SUPER_ADMIN, { groupsFrom: '' })).toBe(false);
  });

  // An unrecognised level is a mistyped setting or a newer server. It hides
  // the control rather than offering it — the opposite direction to an
  // unrecognised role, which is why there are two scales.
  it('refuses an unknown level rather than guessing', () => {
    expect(actor.canAdd(SUPER_ADMIN, { groupsFrom: 'members' })).toBe(false);
    expect(actor.canAdd(SUPER_ADMIN, { groupsFrom: 'moderators' })).toBe(false);
  });

  it('refuses rather than throwing without a viewer', () => {
    expect(actor.canAdd(null, { groupsFrom: 'registered' })).toBe(false);
    expect(actor.canAdd(undefined, { groupsFrom: 'registered' })).toBe(false);
  });
});
