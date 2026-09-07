/**
 * @jest-environment node
 */
/* eslint-env jest */
import fs from 'fs';
import path from 'path';
import { getPersonSections, getGroupTabs, ITEMS } from '../sections';

// Every tab a section builder can return must have a panel to render.
//
// A key with no entry in the panel map renders `undefined`: the tab appears,
// the person clicks it, and the body is empty. No error, no warning, nothing in
// the console — it just looks broken.
//
// That is not hypothetical. Archive and disable were added to getGroupTabs and
// to the PERSON panel map, and the edit meant for the group map matched inside
// the person one instead — because "    [ITEMS.DELETE]" is a substring of
// "      [ITEMS.DELETE]". The person map ended up with the entries twice and
// the group map with neither, so both group tabs opened onto nothing.
//
// Read out of the source rather than by rendering, because rendering these
// panels means a store, a router and a session. The question here is only
// whether the two lists agree.
const indexSource = fs.readFileSync(
  path.join(__dirname, '..', 'index.jsx'),
  'utf8',
);

// The keys assigned in a panel map, e.g. "[ITEMS.DELETE]: <ActorDelete />".
const panelKeysIn = (source, mapName) => {
  const start = source.indexOf(`const ${mapName} = {`);
  if (start === -1) {
    throw new Error(`could not find ${mapName} in index.jsx`);
  }
  const end = source.indexOf('};', start);
  const body = source.slice(start, end);

  return [...body.matchAll(/\[ITEMS\.([A-Z_]+)\]:/g)].map((m) => {
    return m[1];
  });
};

const keyNameFor = (value) => {
  return Object.keys(ITEMS).find((name) => {
    return ITEMS[name] === value;
  });
};

describe('settings tabs and panels agree', () => {
  it('every person section item has a panel', () => {
    const panelKeys = panelKeysIn(indexSource, 'panels');
    const sections = getPersonSections({
      isViewer: true,
      canDelete: true,
      isAdmin: true,
    });

    sections.forEach((section) => {
      section.items.forEach((item) => {
        const name = keyNameFor(item.key);
        expect(panelKeys).toContain(name);
      });
    });
  });

  it('every group tab has a panel', () => {
    const panelKeys = panelKeysIn(indexSource, 'groupPanels');
    const tabs = getGroupTabs({ canDelete: true, isAdmin: true });

    tabs.forEach((tab) => {
      const name = keyNameFor(tab.key);
      expect(panelKeys).toContain(name);
    });
  });

  // A duplicate is harmless at runtime — the last wins — but it means an edit
  // landed somewhere other than where it was aimed, which is how the group map
  // came to be missing its entries.
  it('no panel map assigns the same key twice', () => {
    ['panels', 'groupPanels'].forEach((mapName) => {
      const keys = panelKeysIn(indexSource, mapName);
      expect(keys).toHaveLength(new Set(keys).size);
    });
  });

  // The lifecycle actions specifically, since they are the newest and the ones
  // most likely to be added to one list and forgotten in the other.
  it('groups offer disable, archive and delete', () => {
    const tabs = getGroupTabs({ canDelete: true, isAdmin: true }).map((t) => {
      return t.key;
    });

    expect(tabs).toContain(ITEMS.DISABLE);
    expect(tabs).toContain(ITEMS.ARCHIVE);
    expect(tabs).toContain(ITEMS.DELETE);
  });

  it('hides disable from a non-administrator and archive from those who cannot delete', () => {
    const tabs = getGroupTabs({ canDelete: false, isAdmin: false }).map((t) => {
      return t.key;
    });

    expect(tabs).not.toContain(ITEMS.DISABLE);
    expect(tabs).not.toContain(ITEMS.ARCHIVE);
    expect(tabs).not.toContain(ITEMS.DELETE);
  });
});
