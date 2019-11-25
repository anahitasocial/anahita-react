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
  translation: {
    stories,
  },
  stories: {
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
  groups: {
    cTitle: 'Groups',
    mTitle: 'Groups',
  },
  people: {
    cTitle: 'People',
    mTitle: 'People',
  },
  notes: {
    cTitle: 'Notes',
    mTitle: 'Notes',
  },
  photos: {
    cTitle: 'Photos',
    mTitle: 'Photos',
  },
  topics: {
    cTitle: 'Topics',
    mTitle: 'Topics',
  },
  todos: {
    cTitle: 'Todos',
    mTitle: 'Todos',
  },
  articles: {
    cTitle: 'Articles',
    mTitle: 'Articles',
  },
  hashtags: {
    cTitle: 'Hashtags',
    mTitle: 'Hashtags',
  },
  locations: {
    cTitle: 'Locations',
    mTitle: 'Locations',
  },
  taggables: {
    count: '{{count}} nodes',
  },
  commons: {
    readMore: 'Read more',
    close: 'Close',
  },
};
