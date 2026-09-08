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
    // Archive. The copy does the work here: archive sits next to delete and
    // must never read as the gentler option. Permanence first, then what is
    // preserved — which is the reason to choose it, not a softener.
    archive: 'Archive',
    archivePrompts: {
      permanent: 'Archiving cannot be undone. There is no way to bring this profile back.',
      personDescription: 'Nothing is deleted. Every post, comment and photo stays exactly where it is and keeps its address, so links people have saved will keep working. What stops is the account being active: it leaves feeds and suggestions, and it can no longer be signed in to.',
      selfSignIn: 'You will not be able to sign in again after this, and neither will anyone else — the email address and username stay reserved so nobody can take them.',
      confirmLabel: 'Type {{ alias }} to confirm',
      action: 'Archive permanently',
      archived: 'This profile has been archived.',
      errors: {
        nothingToArchive: 'Nothing to archive — this profile is already archived or scheduled for deletion.',
        forbidden: 'You do not have permission to archive this profile.',
        lastSuperAdmin: 'This is the only super administrator. Promote someone else before archiving this account.',
        generic: 'Could not archive this profile. Please try again.',
      },
    },
    // Disable. Deliberately light — it is a switch, and dressing it up like
    // the two below trains people to type confirmations without reading.
    disable: 'Disable',
    disablePrompts: {
      description: 'Disabling hides this profile and signs the person out. They will not be able to sign in while it is disabled.',
      descriptionDisabled: 'This profile is disabled. The person cannot sign in, and it does not appear anywhere.',
      reversible: 'This can be undone at any time, and nothing is deleted. To remove a profile permanently, archive or delete it instead.',
      action: 'Disable',
      actionEnable: 'Enable',
      disabled: 'This profile has been disabled.',
      enabled: 'This profile has been enabled.',
      errors: {
        forbidden: 'You do not have permission to change this.',
        lastSuperAdmin: 'This is the only super administrator and cannot be disabled.',
        generic: 'Could not change this. Please try again.',
      },
    },
    deletePrompts: {
      counts: {
        intro: 'On this profile right now:',
        posts: '{{ count }} post',
        posts_plural: '{{ count }} posts',
        comments: '{{ count }} comment',
        comments_plural: '{{ count }} comments',
        followers: '{{ count }} follower',
        followers_plural: '{{ count }} followers',
        admins: '{{ count }} administrator',
        admins_plural: '{{ count }} administrators',
        following: 'following {{ count }} person',
        following_plural: 'following {{ count }} people',
        groupsAdministered: 'administrator of {{ count }} group',
        groupsAdministered_plural: 'administrator of {{ count }} groups',
        memberSince: 'A member since {{ date }}.',
      },
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
      access: 'Access',
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
