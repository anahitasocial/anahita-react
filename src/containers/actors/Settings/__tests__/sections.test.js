/**
 * @jest-environment node
 */
/* eslint-env jest */
import fs from 'fs';
import path from 'path';
import {
  getPersonSections,
  getGroupTabs,
  getGroupDangerItems,
  ITEMS,
} from '../sections';

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

  // The Danger panel renders its actions itself, so each of those needs a
  // component in that map too — a missing one is the same empty body, one
  // level down.
  it('every Danger zone action has a component', () => {
    const start = indexSource.indexOf('[ITEMS.DANGER]:');
    const end = indexSource.indexOf('};', start);
    const dangerBlock = indexSource.slice(start, end);

    getGroupDangerItems({ canDelete: true, isAdmin: true }).forEach((item) => {
      expect(dangerBlock).toContain(`[ITEMS.${keyNameFor(item.key)}]:`);
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

  // The three lifecycle actions live behind ONE Danger tab rather than three
  // tabs of their own. A tab strip reads as a list of equals, and choosing
  // between disable, archive and delete means comparing them — which you
  // cannot do across three places.
  it('groups get one Danger tab, not three lifecycle tabs', () => {
    const tabs = getGroupTabs({ canDelete: true, isAdmin: true }).map((t) => {
      return t.key;
    });

    expect(tabs).toContain(ITEMS.DANGER);
    expect(tabs).not.toContain(ITEMS.DISABLE);
    expect(tabs).not.toContain(ITEMS.ARCHIVE);
    expect(tabs).not.toContain(ITEMS.DELETE);
  });

  it('the Danger zone holds disable, archive and delete in that order', () => {
    const items = getGroupDangerItems({ canDelete: true, isAdmin: true }).map((i) => {
      return i.key;
    });

    // Ordered by how reversible each is, not by how severe it sounds.
    expect(items).toEqual([ITEMS.DISABLE, ITEMS.ARCHIVE, ITEMS.DELETE]);
  });

  it('drops the Danger tab when none of its actions apply', () => {
    const tabs = getGroupTabs({ canDelete: false, isAdmin: false }).map((t) => {
      return t.key;
    });

    expect(tabs).not.toContain(ITEMS.DANGER);
  });

  // The tab must survive if ANY of its actions applies, or that action becomes
  // unreachable.
  it('keeps the Danger tab when only one action applies', () => {
    const adminOnly = getGroupTabs({ canDelete: false, isAdmin: true }).map((t) => {
      return t.key;
    });
    expect(adminOnly).toContain(ITEMS.DANGER);
    expect(getGroupDangerItems({ canDelete: false, isAdmin: true }).map((i) => {
      return i.key;
    })).toEqual([ITEMS.DISABLE]);

    const deleteOnly = getGroupTabs({ canDelete: true, isAdmin: false }).map((t) => {
      return t.key;
    });
    expect(deleteOnly).toContain(ITEMS.DANGER);
    expect(getGroupDangerItems({ canDelete: true, isAdmin: false }).map((i) => {
      return i.key;
    })).toEqual([ITEMS.ARCHIVE, ITEMS.DELETE]);
  });
});
