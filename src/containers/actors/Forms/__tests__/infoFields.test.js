/**
 * @jest-environment node
 */
/* eslint-env jest */
import fs from 'fs';
import path from 'path';

// Every field ActorInfoForm reads must be declared by every container that
// renders it.
//
// The form reaches straight into `fields.websiteUrl.error` to decide whether
// to mark an input. A name the container did not declare is not an absent
// input — it is `undefined.error`, so the page throws before rendering
// anything, with nothing on screen to say which field was missing.
//
// That is not hypothetical: websiteUrl was added to the form and to
// actors/Settings/Info, actors/Add was not updated, and /groups/add threw on
// load for everybody.
//
// Read out of the source rather than by rendering, because rendering these
// means a store, a router and an i18n instance. The question is only whether
// two lists agree.
const read = (...parts) => {
  return fs.readFileSync(path.join(__dirname, '..', ...parts), 'utf8');
};

const formSource = read('Info.jsx');

// The names the form dereferences: fields.<name>.something
const fieldsReadByForm = [...new Set(
  [...formSource.matchAll(/\bfields\.(\w+)\s*\./g)].map((m) => {
    return m[1];
  }),
)];

// The names a container passes to form.createFormFields([...]).
const fieldsDeclaredIn = (source, file) => {
  const start = source.indexOf('createFormFields([');
  if (start === -1) {
    throw new Error(`no createFormFields call in ${file}`);
  }

  const body = source.slice(start, source.indexOf('])', start));

  return [...body.matchAll(/'(\w+)'/g)].map((m) => {
    return m[1];
  });
};

const CONSUMERS = [
  ['actors/Add', read('..', 'Add', 'index.jsx')],
  ['actors/Settings/Info', read('..', 'Settings', 'Info.jsx')],
];

describe('ActorInfoForm field declarations', () => {
  it('reads at least one field, or this test is checking nothing', () => {
    expect(fieldsReadByForm.length).toBeGreaterThan(0);
    // The one that broke, named explicitly: if the form stops reading it the
    // test above would still pass while guarding nothing.
    expect(fieldsReadByForm).toContain('websiteUrl');
  });

  CONSUMERS.forEach(([name, source]) => {
    it(`${name} declares every field the form reads`, () => {
      const declared = fieldsDeclaredIn(source, name);

      fieldsReadByForm.forEach((field) => {
        expect(declared).toContain(field);
      });
    });
  });
});
