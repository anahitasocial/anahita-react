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
  },
  translation: {
    stories,
  },
  stories: {
    actions: {
      followOwner: 'Follow {{name}}',
      unfollowOwner: 'Unfollow {{name}}',
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
  commons: {
    readMore: 'Read more',
    close: 'Close',
  },
};
