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
