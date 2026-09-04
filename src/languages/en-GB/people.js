export default {
  cTitle: 'People',
  mTitle: 'People',
  add: {
    cTitle: 'Add person',
    mTitle: 'Add person',
  },
  settings: {
    authlogs: 'Authentications',
    webauthn: 'Pass keys',
    totp: '2FA',
    info: 'Info',
    features: 'Features',
    permissions: 'Permissions',
    access: 'Access',
    // Deletion copy, namespace-specific — groups carry their own in groups.js,
    // because the sign-in and passkey lines here are meaningless for a group.
    delete: 'Delete',
    deletePrompts: {
      description: 'Deleting removes this profile and everything on it: posts, comments, photos, followers and group memberships. Comments other people left on this content go with it.',
      reversible: 'This is not immediate. The profile is hidden straight away and permanently erased after {{ count }} days. Signing in before then will offer to restore it.',
      revoked: 'Sessions on every device end now, and any passkeys are removed. Restoring does not bring those back.',
      handle: 'The handle {{ alias }} stays reserved afterwards, so nobody else can take it.',
      scheduled: 'This profile is scheduled for deletion. Sign in before {{ date }} to restore it.',
    },
    notifications: 'Notification settings',
    followRequests: 'Follow requests',
    password: 'Password',
    email: 'Email',
    username: 'Username',
    // Section labels for the grouped person settings page. The keys above
    // are still used as the per-card titles inside a section.
    sections: {
      account: 'Account',
      security: 'Security',
      privacy: 'Privacy',
      danger: 'Danger zone',
    },
  },
  notifications: {
    cTitle: 'Notifications',
    cDescription: 'Edit your notification settings',
    mTitle: 'Notifications',
    email: 'Recieve email notifications',
    optionsTitle: 'Get notifications for',
    options: {
      all: 'All the posts',
      following: 'Only the posts that you are following',
    },
  },
  person: {
    givenName: 'First name',
    familyName: 'Last name',
    username: 'Username',
    email: 'Email',
    body: 'Bio',
    pronouns: 'Pronouns',
    whatPronouns: 'What pronouns do you use?',
    pronounOptions: {
      feminine: 'Femminine',
      masculine: 'Masculine',
      nonbinary: 'Nonbinary',
    },
    usertype: 'User type',
    usertypeOptions: {
      guest: 'Guest',
      registered: 'Registered',
      administrator: 'Admin',
      'super-administrator': 'Super Admin',
    },
    joinedDate: 'Joined on {{ date }}',
    lastVisitOn: 'Last visit on {{ date }}',
  },
  confirm: {
    delete: "Do you want to delete {{ name }}'s profile?",
    block: "Do you want to block {{ name }}'s profile?",
  },
  account: {
    prompts: {
      error: 'Something went wrong!',
      errorUsernameTaken: 'Username is already taken!',
      errorEmailTaken: 'Email is already available in our system!',
    },
  },
};
