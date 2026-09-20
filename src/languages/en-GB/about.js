// The public About page. Not a setting — see containers/about.
export default {
  cTitle: 'About',
  mTitle: 'About',
  cDescription: 'What this site is running.',
  unavailable: 'This site did not return its NodeInfo document.',
  readOnly: 'Reported by the server. Change these in the server configuration.',
  // Two headings and one set of bare field labels, so a row says
  // "Repository" rather than "Server repository" under a heading
  // that already said Server.
  server: {
    mTitle: 'Server',
  },
  client: {
    mTitle: 'Client',
  },
  fields: {
    name: 'Name',
    version: 'Version',
    license: 'Licence',
    repository: 'Repository',
  },
  usage: {
    mTitle: 'Usage',
    people: 'People',
    activeMonth: 'Active this month',
    activeHalfyear: 'Active in six months',
    localPosts: 'Posts',
  },
  registration: {
    mTitle: 'Registration',
    mode: 'Mode',
    open: 'Open',
    closed: 'Closed',
    approvalRequired: 'Approval required',
    invitationsAccepted: 'Invitations accepted',
  },
  contact: {
    mTitle: 'Contact and legal',
    supportEmail: 'Support email',
    supportPhone: 'Support phone',
    termsOfService: 'Terms of service',
    privacyPolicy: 'Privacy policy',
  },
};
