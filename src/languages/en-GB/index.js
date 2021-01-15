import settings from './settings';
import stories from './stories';

export default {
  actions: {
    follow: 'Follow',
    unfollow: 'Unfollow',
    block: 'Block',
    unblock: 'Unblock',
    like: 'Like',
    unlike: 'Unlike',
    delete: 'Delete',
    subscribe: 'Get Notifications',
    unsubscribe: 'Stop Notifications',
    add: 'Add',
    edit: 'Edit',
    update: 'Update',
    cancel: 'Cancel',
    post: 'Post',
    openComments: 'Open Comments',
    closeComments: 'Close Comments',
  },
  access: {
    people: {
      public: 'Public',
      registered: 'Registered',
      followers: 'Followers',
      leaders: 'Leaders',
      mutuals: 'Mutuals',
      admins: 'Only You',
    },
    groups: {
      public: 'Public',
      registered: 'Registered',
      followers: 'Followers',
      admins: 'Only You',
    },
  },
  apps: {
    articles: 'Articles',
    documents: 'Documents',
    notes: 'Notes',
    photos: 'Photos',
    todos: 'Todos',
  },
  translation: {
    stories,
  },
  stories: {
    cTitle: 'Stories',
    mTitle: 'Stories',
    actions: {
      followOwner: 'Follow {{name}}',
      unfollowOwner: 'Unfollow {{name}}',
      blockOwner: 'Block {{name}}',
      unblockOwner: 'Unblock {{name}}',
    },
  },
  comments: {
    comment: {
      placeholder: 'Add a comment ...',
      bodyErrorHelperText: 'Comment box is empty!',
    },
    actions: {
      followAuthor: 'Follow {{name}}',
      unfollowAuthor: 'Unfollow {{name}}',
      blockAuthor: 'Block {{name}}',
      unblockAuthor: 'Unblock {{name}}',
    },
  },
  auth: {
    logout: 'Logout',
  },
  actor: {
    unknown: 'Unknown',
  },
  dashboard: {
    cTitle: 'Dashboard',
    mTitle: 'Dashboard',
  },
  documents: {
    cTitle: 'Documents',
    mTitle: 'Documents',
    settings: {
      document: {
        add: 'Who can post a document on this profile?',
        addcomment: 'Who can comment on documents?',
      },
    },
  },
  settings: {
    cTitle: 'Settings',
    mTitle: 'Settings',
    ...settings,
  },
  groups: {
    cTitle: 'Groups',
    mTitle: 'Groups',
    settings: {
      info: 'Info',
      admins: 'Admins',
      apps: 'Apps',
      permissions: 'Permissions',
      privacy: 'Privacy',
      delete: 'Delete',
    },
  },
  people: {
    cTitle: 'People',
    mTitle: 'People',
    settings: {
      info: 'Info',
      account: 'Account',
      apps: 'Apps',
      permissions: 'Permissions',
      privacy: 'Privacy',
      delete: 'Delete',
    },
  },
  notes: {
    cTitle: 'Notes',
    mTitle: 'Notes',
    settings: {
      note: {
        add: 'Who can post a note on this profile?',
        addcomment: 'Who can comment on notes?',
      },
    },
  },
  photos: {
    cTitle: 'Photos',
    mTitle: 'Photos',
    settings: {
      photo: {
        add: 'Who can post photos on this profile?',
        addcomment: 'Who can comment on photos?',
      },
      set: {
        add: 'Who can create sets on this profile?',
        addcomment: 'Who can comment on sets?',
      },
    },
  },
  topics: {
    cTitle: 'Topics',
    mTitle: 'Topics',
    settings: {
      topic: {
        add: 'Who can start a topic on this profile?',
        addcomment: 'Who can comment on topics?',
      },
    },
  },
  todos: {
    cTitle: 'Todos',
    mTitle: 'Todos',
    settings: {
      todo: {
        add: 'Who can add a todo on this profile?',
        addcomment: 'Who can comment on todos?',
      },
    },
  },
  articles: {
    cTitle: 'Articles',
    mTitle: 'Articles',
    settings: {
      article: {
        add: 'Who can publish an article on this profile?',
        addcomment: 'Who can comment on articles?',
        edit: 'Who can edit an article on this profile?',
      },
    },
  },
  hashtags: {
    cTitle: 'Hashtags',
    mTitle: 'Hashtags',
  },
  locations: {
    cTitle: 'Locations',
    mTitle: 'Locations',
  },
  search: {
    cTitle: 'Search',
    mTitle: 'Search',
  },
  taggables: {
    count: '{{count}} nodes',
  },
  commons: {
    readMore: 'Read more',
    close: 'Close',
  },
};
