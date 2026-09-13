/* eslint-env jest */
import fs from 'fs';
import path from 'path';

import signup from '../signup';

// AuthSignupForm destructures SIGNUP.FIELDS and then reads .MAX_LENGTH off
// each one. A field the form asks for and this file does not declare is
// `undefined.MAX_LENGTH` — a TypeError at render, which takes the whole
// signup page down rather than degrading.
//
// That is exactly what happened: the form moved to a single `name` field
// while this file still declared GIVEN_NAME and FAMILY_NAME, so nobody could
// reach the signup page at all. Nothing caught it, because the constants and
// the component are only connected at runtime.
//
// This reads the component's source and checks the two agree.

const formSource = fs.readFileSync(
  path.join(__dirname, '../../components/AuthSignupForm.jsx'),
  'utf8',
);

const destructuredFields = () => {
  const block = formSource.match(/}\s*=\s*SIGNUP\.FIELDS;/);
  expect(block).not.toBeNull();

  const opening = formSource.lastIndexOf('const {', block.index);
  return formSource
    .slice(opening + 'const {'.length, block.index)
    .split(',')
    .map((name) => { return name.trim(); })
    .filter(Boolean);
};

describe('signup field constants', () => {
  it('declares every field the form destructures', () => {
    destructuredFields().forEach((field) => {
      expect(signup.FIELDS[field]).toBeDefined();
    });
  });

  it('gives every field a usable length pair', () => {
    Object.entries(signup.FIELDS).forEach(([name, limits]) => {
      expect(typeof limits.MIN_LENGTH).toBe('number');
      expect(typeof limits.MAX_LENGTH).toBe('number');
      expect(limits.MIN_LENGTH).toBeLessThanOrEqual(limits.MAX_LENGTH);
      expect(name).toBe(name.toUpperCase());
    });
  });

  // The server validates min=15 on both signup and invite-accept. A shorter
  // rule here does not weaken anything — the request is simply refused — but
  // it tells people a password is acceptable and then rejects it.
  it('matches the password rule the server enforces', () => {
    expect(signup.FIELDS.PASSWORD.MIN_LENGTH).toBe(15);
  });

  // nodes.name is 100 on the server side, and the display name is one field
  // rather than the given/family pair it replaced.
  it('allows a full display name', () => {
    expect(signup.FIELDS.NAME.MAX_LENGTH).toBe(100);
    expect(signup.FIELDS.GIVEN_NAME).toBeUndefined();
    expect(signup.FIELDS.FAMILY_NAME).toBeUndefined();
  });
});
