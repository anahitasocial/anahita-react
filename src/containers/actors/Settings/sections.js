// Grouping for the person settings page.
//
// The page grew to eleven flat tabs once username, email and password each
// became their own card, which scrolled on every screen and put credential
// management, profile fields and account deletion in one undifferentiated row.
// These four sections restore the distinction.
//
// People get SECTIONS; groups keep flat tabs, because a group has none of the
// account or security items and there is nothing there to group. Both render
// through the same stacked-card layout though — see getGroupTabs — so a group's
// Danger zone looks exactly like a person's rather than like a different app.
//
// Keys, not elements. This module stays free of JSX so the page owns rendering
// and this owns what exists and when. Same split as utils.node's
// getActorFeatureTabs, which containers/actors/Read/Body.jsx consumes.

export const SECTIONS = {
  ACCOUNT: 'account',
  SECURITY: 'security',
  PRIVACY: 'privacy',
  DANGER: 'danger',
};

// Landing section when the URL names none, or names one the viewer cannot see.
export const DEFAULT_SECTION = SECTIONS.ACCOUNT;

// Item keys. These double as i18n lookups and as React keys.
export const ITEMS = {
  INFO: 'info',
  ADMINS: 'admins',
  EMAIL: 'email',
  USERNAME: 'username',
  PASSWORD: 'password',
  TOTP: 'totp',
  WEBAUTHN: 'webauthn',
  AUTHLOGS: 'authlogs',
  ACCESS: 'access',
  DELETE: 'delete',
};

// `bare` says the item's component does NOT render its own MUI Card, so the
// page has to supply one or it sits flush against its neighbours with no title.
// Verified per component rather than assumed:
//
//   own Card — auth/Password, auth/Email, auth/Username, auth/WebAuthn,
//              auth/Totp (via TotpSteps), actors/Settings/Access
//   bare     — auth/Authlogs, people/Settings/Info, actors/Settings/Delete
//
// Access is a Card with no CardHeader, so it reads as untitled next to the
// others. Left as-is here: giving it a header is a change to a shared component
// rather than to this page.
const ALL_SECTIONS = [
  {
    key: SECTIONS.ACCOUNT,
    items: [
      { key: ITEMS.INFO, bare: true, viewerOnly: false },
      { key: ITEMS.EMAIL, bare: false, viewerOnly: true },
      { key: ITEMS.USERNAME, bare: false, viewerOnly: true },
    ],
  },
  {
    key: SECTIONS.SECURITY,
    // Password first, deliberately. /people/:id/settings/password redirects
    // here, and that URL is in the username-change notification email — the
    // card it names should be the one at the top of the page.
    items: [
      { key: ITEMS.PASSWORD, bare: false, viewerOnly: true },
      { key: ITEMS.TOTP, bare: false, viewerOnly: true },
      { key: ITEMS.WEBAUTHN, bare: false, viewerOnly: true },
      { key: ITEMS.AUTHLOGS, bare: true, viewerOnly: true },
    ],
  },
  {
    key: SECTIONS.PRIVACY,
    items: [
      { key: ITEMS.ACCESS, bare: false, viewerOnly: false },
    ],
  },
  {
    key: SECTIONS.DANGER,
    items: [
      {
        key: ITEMS.DELETE,
        bare: true,
        viewerOnly: false,
        requiresDelete: true,
      },
    ],
  },
];

// getPersonSections returns the sections this viewer can actually see, each
// carrying only its visible items.
//
// A section with nothing left in it is dropped rather than rendered empty, so
// somebody looking at another person's settings gets no Security tab at all
// instead of a tab that opens onto nothing.
//
// viewerOnly is the gate that matters here. Every security item is scoped to
// the signed-in account — the endpoints behind them take no actor id — and
// applying it uniformly is what closes the sign-in-activity hole the flat
// layout had: its Tab was gated on the viewer but its panel only on the
// namespace, so loading somebody else's settings requested their session list.
export const getPersonSections = ({ isViewer, canDelete }) => {
  return ALL_SECTIONS
    .map((section) => {
      const items = section.items.filter((item) => {
        if (item.viewerOnly && !isViewer) {
          return false;
        }

        if (item.requiresDelete && !canDelete) {
          return false;
        }

        return true;
      });

      return { ...section, items };
    })
    .filter((section) => {
      return section.items.length > 0;
    });
};

// resolveSection picks the section to show for a URL segment.
//
// Falls back rather than erroring: a stale bookmark, a hand-typed path, or a
// section that has become invisible (a passkey-less person opening a Security
// link) should land somewhere usable. Returning a section that is not in the
// list would hand MUI a Tabs value it cannot match, which is what the groups
// namespace does today and why it logs a warning and renders an empty body.
export const resolveSection = (requested, sections) => {
  const match = sections.find((section) => {
    return section.key === requested;
  });

  if (match) {
    return match;
  }

  const fallback = sections.find((section) => {
    return section.key === DEFAULT_SECTION;
  });

  return fallback || sections[0];
};

export default getPersonSections;

// getGroupTabs returns the flat tabs for the groups namespace.
//
// Not sections: four tabs do not need grouping. The shape matches a section's
// items so both namespaces can share one renderer, which is what makes a
// group's Danger zone identical to a person's — the alternative was one tab on
// the page drawn differently from its neighbours, which reads as a bug.
//
// `bare` follows the same rule as everywhere else: true when the component does
// not render its own Card. Verified per component — Access brings one, Info,
// Admins and Delete do not.
export const getGroupTabs = ({ canDelete }) => {
  return [
    { key: ITEMS.INFO, bare: true },
    { key: ITEMS.ADMINS, bare: true },
    { key: ITEMS.ACCESS, bare: false },
    { key: ITEMS.DELETE, bare: true, requiresDelete: true },
  ].filter((item) => {
    return !item.requiresDelete || canDelete;
  });
};
