/* eslint-env jest */
/**
 * @jest-environment jsdom
 */
import fs from 'fs';
import path from 'path';

import utils from '../../utils/api';

// Everything in the app is camelCase. The rule is enforced in exactly one
// place — the response interceptor in api/index.js — registered on the DEFAULT
// axios instance, so it covers the modules that call axios directly as well as
// the ones that go through create().
//
// Worth a test because the rule is invisible when it works AND invisible when
// it does not. A single-word key camel-cases to itself, so `usertype` passed
// through looking transformed and nothing in the app ever had to know the rule
// existed. The first multi-word key is where it bites, and by then the wrong
// spelling is read in a dozen places.
//
// That is what happened to the viewer: the server sent `usertype`, which
// survived unchanged, while every permission helper read `personType`. The
// server sends `person_type` now and the interceptor does the rest.
//
// The interceptor itself cannot be exercised here — the installed axios is
// ESM-only and CRA's jest does not transform it, which is why this directory
// has no other tests. So this covers the two halves separately: the transform
// against real payloads, and the registration by reading the source.

const apiIndex = fs.readFileSync(
  path.join(__dirname, '../index.js'),
  'utf8',
);

describe('the response transform', () => {
  // The shape /oauth/userinfo returns.
  it('camel-cases the userinfo payload', () => {
    const data = utils.camelCaseKeys({
      sub: '42',
      name: 'Ada Lovelace',
      alias: 'ada',
      person_type: 'super-administrator',
      preferred_username: 'ada',
      totp_enabled: false,
      last_visit_date: '2026-09-13T20:37:42Z',
      avatar_urls: { large: { url: 'https://example.com/a.png' } },
    });

    // The two the app gates on.
    expect(data.personType).toBe('super-administrator');
    expect(data.alias).toBe('ada');

    expect(data.totpEnabled).toBe(false);
    expect(data.lastVisitDate).toBe('2026-09-13T20:37:42Z');
    expect(data.preferredUsername).toBe('ada');
    expect(data.avatarUrls.large.url).toBe('https://example.com/a.png');

    // The wire spellings must not survive alongside the camelCase ones — a
    // reader finding either would not know which is authoritative.
    expect(data.person_type).toBeUndefined();
    expect(data.avatar_urls).toBeUndefined();
  });

  it('converts nested objects and arrays', () => {
    const data = utils.camelCaseKeys({
      items: [{ website_url: 'https://example.com', owner_id: 7 }],
      meta: { total_count: 1 },
    });

    expect(data.items[0].websiteUrl).toBe('https://example.com');
    expect(data.items[0].ownerId).toBe(7);
    expect(data.meta.totalCount).toBe(1);
  });

  // Values are data, not identifiers. Converting them would rewrite somebody's
  // display name.
  it('leaves values alone', () => {
    const data = utils.camelCaseKeys({
      display_name: 'jean-luc picard',
      person_type: 'super-administrator',
    });

    expect(data.displayName).toBe('jean-luc picard');
    expect(data.personType).toBe('super-administrator');
  });

  // Applying it twice must be safe. Several modules could reasonably each
  // decide to convert, and the result has to be the same either way.
  it('is idempotent', () => {
    const once = utils.camelCaseKeys({ person_type: 'registered' });

    expect(utils.camelCaseKeys(once)).toEqual(once);
  });
});

describe('the interceptor that applies it', () => {
  it('is registered on the shared axios instance', () => {
    expect(apiIndex).toMatch(/axios\.interceptors\.response\.use/);
    expect(apiIndex).toMatch(/camelCaseKeys\(response\.data\)/);
  });

  // The guard. It is what keeps the transform off responses from somewhere
  // else — a presigned upload to S3, say — and it is also why every module
  // that calls axios with a RELATIVE url is covered: a relative request
  // inherits axios.defaults.baseURL, so the comparison holds.
  it('is scoped to this API by baseURL', () => {
    expect(apiIndex).toMatch(/response\.config\.baseURL === axios\.defaults\.baseURL/);
  });

  // Errors carry payloads too — a 409 from signup names the field that
  // collided — and a reader should not have to know which spelling arrives
  // depending on the status code.
  it('covers error responses as well', () => {
    expect(apiIndex).toMatch(/camelCaseKeys\(error\.response\.data\)/);
  });
});
