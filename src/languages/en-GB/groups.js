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
    // Archive. The copy does the work here: archive sits next to delete and
    // must never read as the gentler option. Permanence first, then what is
    // preserved — which is the reason to choose it, not a softener.
    archive: 'Archive',
    archivePrompts: {
      permanent: 'Archiving cannot be undone. There is no way to bring this group back.',
      groupDescription: 'Nothing is deleted. Every post, photo and discussion stays exactly where it is and keeps its address, so links people have saved will keep working. What stops is the group being active: it leaves feeds, suggestions and search, and nobody can post to it again.',
      confirmLabel: 'Type {{ alias }} to confirm',
      action: 'Archive permanently',
      archived: 'This group has been archived.',
      errors: {
        nothingToArchive: 'Nothing to archive — this group is already archived or scheduled for deletion.',
        forbidden: 'You do not have permission to archive this group.',
        lastSuperAdmin: 'This is the only super administrator. Promote someone else before archiving this group.',
        generic: 'Could not archive this group. Please try again.',
      },
    },
    // Disable. Deliberately light — it is a switch, and dressing it up like
    // the two below trains people to type confirmations without reading.
    disable: 'Disable',
    disablePrompts: {
      description: 'Disabling hides this group from everyone. Its members cannot post to it or find it while it is disabled.',
      descriptionDisabled: 'This group is disabled. It does not appear anywhere and nobody can post to it.',
      reversible: 'This can be undone at any time, and nothing is deleted. To remove a profile permanently, archive or delete it instead.',
      action: 'Disable',
      actionEnable: 'Enable',
      disabled: 'This group has been disabled.',
      enabled: 'This group has been enabled.',
      errors: {
        forbidden: 'You do not have permission to change this.',
        lastSuperAdmin: 'This is the only super administrator and cannot be disabled.',
        generic: 'Could not change this. Please try again.',
      },
    },
    deletePrompts: {
      counts: {
        intro: 'In this group right now:',
        posts: '{{ count }} post',
        posts_plural: '{{ count }} posts',
        comments: '{{ count }} comment',
        comments_plural: '{{ count }} comments',
        followers: '{{ count }} follower',
        followers_plural: '{{ count }} followers',
        admins: '{{ count }} administrator',
        admins_plural: '{{ count }} administrators',
        memberSince: 'Created {{ date }}.',
      },
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
