/**
 * @jest-environment node
 */
/* eslint-env jest */
import node from '../node';

// The read endpoints do not agree on what identifies an actor: person-service
// registers GET /people/:username, group-service GET /groups/:id. Passing the
// wrong one 404s from a lookup that searched for a username spelled "51".
//
// That happened: re-reading an actor after a successful enable/disable used
// the id for a person. The PATCH returned 200 and the change was written, then
// the refresh 404ed and the card reported a failure for something that had
// worked — the worst shape of bug, because the state on screen disagreed with
// the state in the database.
describe('readIdentifier', () => {
  const person = { id: 51, alias: 'snoble', type: 'node.actor.person-service.person.v1' };
  const group = { id: 42242, alias: 'anahita-project', type: 'node.actor.group-service.group.v1' };

  it('addresses a person by their username', () => {
    expect(node.readIdentifier(person, 'people')).toBe('snoble');
  });

  it('addresses a group by its id', () => {
    expect(node.readIdentifier(group, 'groups')).toBe(42242);
  });

  // A person's alias IS their username, so this must not quietly fall back to
  // the id when the alias is missing — that would 404 in exactly the case the
  // helper exists to prevent, and silently.
  it('does not fall back to the id for a person', () => {
    expect(node.readIdentifier({ id: 51 }, 'people')).toBeUndefined();
  });

  it('tolerates a missing node', () => {
    expect(node.readIdentifier(null, 'people')).toBeUndefined();
    expect(node.readIdentifier(undefined, 'groups')).toBeUndefined();
  });
});

// The photo service lists all seven sizes for every photo — it formats each
// URL from the filename without checking the derivative was ever written — so
// an advertised size can 404. Callers need somewhere to fall back to.
describe('getPortraitURLs', () => {
  const withSizes = (sizes) => {
    return {
      portraitUrls: sizes.reduce((urls, size) => {
        return { ...urls, [size]: { url: `https://cdn.test/photo_${size}.jpg` } };
      }, {}),
    };
  };

  it('leads with the size that was asked for', () => {
    const photo = withSizes(['large', 'medium', 'small']);
    expect(node.getPortraitURLs(photo, 'large')[0]).toBe('https://cdn.test/photo_large.jpg');
  });

  it('follows it with the smaller sizes, largest first', () => {
    const photo = withSizes(['xxlarge', 'xlarge', 'large', 'medium', 'small', 'original']);
    expect(node.getPortraitURLs(photo, 'large')).toEqual([
      'https://cdn.test/photo_large.jpg',
      'https://cdn.test/photo_medium.jpg',
      'https://cdn.test/photo_small.jpg',
      'https://cdn.test/photo_original.jpg',
    ]);
  });

  // Falling back upwards would hand a lightbox a bigger file than the one that
  // just failed, and a centre-cropped square is not a stand-in for any of them.
  it('never falls back to a larger size or to the square crop', () => {
    const photo = withSizes(['xxlarge', 'square', 'medium', 'small']);
    expect(node.getPortraitURLs(photo, 'medium')).toEqual([
      'https://cdn.test/photo_medium.jpg',
      'https://cdn.test/photo_small.jpg',
    ]);
  });

  it('drops sizes the photo does not list at all', () => {
    const photo = withSizes(['medium']);
    expect(node.getPortraitURLs(photo, 'large')).toEqual(['https://cdn.test/photo_medium.jpg']);
  });

  it('returns nothing for a node with no portrait', () => {
    expect(node.getPortraitURLs({}, 'large')).toEqual([]);
  });
});

// The authority checks read `personType`, camelCase — api/index.js camel-cases
// every response key, so the server's person_type arrives renamed.
//
// This is worth a test because getting it wrong is silent. An undefined field
// compares false against every level, so the wrong name raises nothing: it
// makes everybody an ordinary member and removes the administration UI, with
// no error anywhere to say so. That is exactly what happened when the API
// renamed usertype — a single word, which survived the camelCase transform
// untouched, so nothing in the client had ever had to know the rule.
describe('authority checks', () => {
  const superAdmin = { personType: 'super-administrator' };
  const admin = { personType: 'administrator' };
  const registered = { personType: 'registered' };

  it('recognises a super administrator', () => {
    expect(node.isSuperAdmin(superAdmin)).toBe(true);
    expect(node.isAdmin(superAdmin)).toBe(true);
  });

  it('does not promote an ordinary member', () => {
    expect(node.isSuperAdmin(registered)).toBe(false);
    expect(node.isAdmin(registered)).toBe(false);
    expect(node.isRegistered(registered)).toBe(true);
  });

  it('recognises an administrator but not a super administrator', () => {
    expect(node.isAdmin(admin)).toBe(true);
    expect(node.isSuperAdmin(admin)).toBe(false);
  });

  // The regression itself: the snake_case the API sends must NOT be what the
  // client reads, or every check answers false.
  it('does not read the snake_case key the API sends', () => {
    expect(node.isSuperAdmin({ person_type: 'super-administrator' })).toBe(false);
  });

  it('treats a missing actor as nobody rather than throwing', () => {
    expect(node.isSuperAdmin(undefined)).toBe(false);
    expect(node.isAdmin(null)).toBe(false);
  });
});
