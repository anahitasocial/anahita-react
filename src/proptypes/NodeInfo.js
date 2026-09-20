import {
  shape,
  arrayOf,
  number,
  string,
  bool,
} from 'prop-types';

// NodeInfo 2.1 — what this installation says about itself.
//
// http://nodeinfo.diaspora.software/protocol.html
//
// A public, standard document, which is why the About tab is read-only:
// there is no write endpoint behind any of this. Every field is either
// counted from the database or set from auth-service's environment, so
// the way to change what About shows is to change the server and
// restart it.
//
// The keys are already camelCase in the published document, so the
// response interceptor passes them through unchanged.
export default shape({
  version: string,
  software: shape({
    name: string,
    version: string,
    repository: string,
  }),
  protocols: arrayOf(string),
  services: shape({
    inbound: arrayOf(string),
    outbound: arrayOf(string),
  }),
  openRegistrations: bool,
  usage: shape({
    users: shape({
      total: number,
      activeMonth: number,
      activeHalfyear: number,
    }),
    localPosts: number,
  }),
  metadata: shape({
    nodeName: string,
    // Set by the operator, or empty. Never generated — a description
    // assembled from the software name would read the same on every
    // Anahita server.
    nodeDescription: string,
    // open, approval, invite or closed. Decides both whether
    // openRegistrations is true and whether the approval queue in the
    // Signup Requests tab ever has anything in it.
    registrationMode: string,
    approvalRequired: bool,
    // Whether invitations are being issued at all. False whenever the
    // registration mode is `closed`, which suspends them site-wide — see
    // auth-service Config.AllowsInvitations.
    invitationsAccepted: bool,
    // The minimum role that may issue one: registered, administrators or
    // super-administrators. Read alongside invitationsAccepted, never on its
    // own — clearing the level means nothing while the site is locked down.
    invitesFrom: string,
    // The minimum role that may create a group: registered, administrators or
    // super-administrators. GROUP-SERVICE enforces it; this document reports
    // it so the web app knows whether to offer a + on the groups page.
    groupsFrom: string,
    supportEmail: string,
    supportPhone: string,
    supportWebsite: string,
    termsOfServiceUrl: string,
    privacyPolicyUrl: string,
  }),
});
