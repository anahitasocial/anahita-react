export default {
  about: 'About',
  name: 'Name',
  alias: 'Alias',
  website: 'Website',
  body: 'Description',
  unknown: 'Unknown',
  delete: {
    // The card said nothing about what deletion does, whether it is
    // reversible, or when it takes effect — it offered one text field and a
    // red button. These strings are the disclosure.
    prompts: {
      challenge: 'Type {{ alias }} to confirm',
      inProgress: 'Deleting in progress ...',
    },
    errors: {
      generic: 'Could not delete this profile. Please try again.',
      forbidden: 'You do not have permission to delete this profile.',
      // Fallback only. The server sends a message naming the way out, and
      // it is more specific than this can be.
      lastSuperAdmin: 'This is the only super administrator. Promote someone else, or change this account to administrator, before deleting it.',
    },
  },
  access: {
    title: 'Access',
    cDescription: 'Who can see this profile.',
    // One sentence per level, because the label alone does not say who
    // it means — "Mutuals" and "Leaders" are the site's words, not
    // everybody's.
    descriptions: {
      public: 'Anyone, signed in or not.',
      registered: 'Anyone with an account here.',
      followers: 'People who follow this profile.',
      leaders: 'People this profile follows.',
      mutuals: 'People who follow this profile and are followed back.',
      admins: 'Administrators of this group.',
      myself: 'Nobody else.',
    },
    labels: {
      whoCanSee: 'Who can see this profile?',
      othersCanRequestToFollow: 'Others can request to follow',
      whoCanAddFollowers: 'Who can add followers?',
    },
    alerts: {
      success: 'Access was updated',
      error: 'Access could not be updated.',
    },
  },
};
