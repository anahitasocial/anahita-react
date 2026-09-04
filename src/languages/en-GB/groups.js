export default {
  cTitle: 'Groups',
  mTitle: 'Groups',
  add: {
    cTitle: 'Create group',
    mTitle: 'Create group',
  },
  settings: {
    info: 'Info',
    admins: 'Admins',
    features: 'Features',
    permissions: 'Permissions',
    access: 'Access',
    // Deletion copy, namespace-specific. The shared actor:delete strings told
    // group administrators to "sign in to restore", which a group cannot do,
    // and that their passkeys would be removed, which a group has none of.
    delete: 'Delete',
    deletePrompts: {
      description: 'Deleting removes this group and everything in it: posts, photos, comments and the membership list. Content other members contributed goes with it.',
      reversible: 'This is not immediate. The group is hidden straight away and permanently erased after {{ count }} days. Any administrator can restore it from this page before then.',
      revoked: 'Members lose access immediately, and the group disappears from their profiles and feeds.',
      handle: 'The name {{ alias }} stays reserved afterwards, so no other group can take it.',
      scheduled: 'This group is scheduled for deletion and will be erased on {{ date }}.',
      restore: 'Restore this group',
      restored: 'This group has been restored.',
      errors: {
        restoreFailed: 'Could not restore this group. It may already have been permanently erased.',
      },
    },
    // Labels the tab; the card inside it still reads "Delete".
    sections: {
      danger: 'Danger zone',
    },
    notifications: 'Notification settings',
    followRequests: 'Follow requests',
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
  confirm: {
    delete: "Do you want to delete {{ name }}'s profile?",
    block: "Do you want to block {{ name }}'s profile?",
  },
};
