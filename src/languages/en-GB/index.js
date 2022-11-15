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
    save: 'Save',
    done: 'Done',
    cancel: 'Cancel',
    create: 'Create',
    post: 'Post',
    publish: 'Publish',
    openComments: 'Open Comments',
    closeComments: 'Close Comments',
    login: 'Login',
    download: 'Download',
  },
  prompts: {
    updated: {
      success: 'Updated successfully',
      error: "Something went wrong and couldn't update",
    },
    saved: {
      success: 'Saved successfully',
      error: "Something went wrong and couldn't save",
    },
    deleted: {
      success: 'Deleted successfully',
      error: 'Something went wrong and couldn\'t delete',
    },
  },
  access: {
    public: 'Public',
    registered: 'Logged-in People',
    followers: 'Followers',
    leaders: 'Leaders',
    mutuals: 'Mutuals',
    admins: 'Only You',
  },
  apps: {
    articles: 'Articles',
    documents: 'Documents',
    notes: 'Notes',
    photos: 'Photos',
    todos: 'Todos',
    topics: 'Topics',
  },
  translation: {
    stories,
  },
  pages: {
    about: 'About',
    tos: 'Terms Of Service',
    join: 'Join Us',
    privacy: 'Privacy',
    support: 'Support',
    report: 'Report Issues',
    guideline: 'Tribes Guideline',
  },
  social: {
    cTitle: 'Social Media',
    mTitle: 'Social Media',
    description: 'Like & Follow us',
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
    cTitle: 'Please log in',
    mTitle: 'Login',
    logout: 'Logout',
    login: 'Please log in',
    username: 'Email or Username',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    passwordResetEmail: 'What is your email?',
    actions: {
      resetPassword: 'Reset password',
    },
    signup: {
      cTitle: 'Please signup',
      mTitle: 'Signup',
      firstName: 'First name',
      lastName: 'Last name',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      actions: {
        signup: 'Signup',
      },
    },
    prompts: {
      error: 'Something went wrong!',
      errorSignupUsernameTaken: 'Username is already taken!',
      errorSignupEmailTaken: 'Email is already available in our system!',
      errorTokenInvalid: 'This is an invalid token!',
      passwordResetEmailSuccess: 'We emailed you a link. Please click on that link and follow the instructions!',
      signupEmailSuccess: 'Thank you! We just emailed you an account activation link.',
    },
  },
  actor: {
    about: 'About',
    name: 'Name',
    body: 'Description',
    unknown: 'Unknown',
    delete: {
      prompts: {
        challenge: 'Type the exact alias: {{ alias }}',
        inProgress: 'Deleting in progress ...',
      },
    },
    privacy: {
      title: 'Privacy Alert',
      content: 'This profile will be publicly visible. Would you like to proceed?',
      labels: {
        whoCanSee: 'Who can see this profile?',
        othersCanRequestToFollow: 'Others can request to follow',
        whoCanAddNewFollowers: 'Who can can add new followers?',
      },
    },
    meta: {
      website: 'Website',
      contact: 'Contact',
      contactUrl: 'Contact URL',
      phone: 'Phone',
    },
  },
  blogs: {
    cTitle: 'Blogs',
    mTitle: 'Blogs',
  },
  dashboard: {
    cTitle: 'Dashboard',
    mTitle: 'Dashboard',
  },
  home: {
    cTitle: 'Home',
    mTitle: 'Home',
  },
  documents: {
    cTitle: 'Documents',
    mTitle: 'Documents',
    composer: {
      select: 'Select or Drop a document file here',
      name: 'Name',
      namePlaceholder: 'Name this document ...',
      body: 'Description',
      bodyPlaceholder: 'Write a description ...',
    },
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
    add: {
      cTitle: 'Create group',
      mTitle: 'Create group',
    },
    settings: {
      info: 'Info',
      admins: 'Admins',
      apps: 'Apps',
      permissions: 'Permissions',
      privacy: 'Privacy',
      delete: 'Delete',
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
  },
  people: {
    cTitle: 'People',
    mTitle: 'People',
    add: {
      cTitle: 'Add person',
      mTitle: 'Add person',
    },
    settings: {
      info: 'Info',
      account: 'Account',
      apps: 'Apps',
      permissions: 'Permissions',
      privacy: 'Privacy',
      delete: 'Delete',
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
    person: {
      givenName: 'First name',
      familyName: 'Last name',
      username: 'Username',
      email: 'Email',
      newPassword: 'New password',
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
    },
  },
  notifications: {
    cTitle: 'Notifications',
    mTitle: 'Notifications',
  },
  notes: {
    cTitle: 'Notes',
    mTitle: 'Notes',
    composer: {
      bodyPlaceholderPerson: "Posting on {{ name }}'s profile",
      bodyPlaceholder: 'What\'s new?',
    },
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
    composer: {
      select: 'Select or Drop a photo file here',
      name: 'Title',
      namePlaceholder: "Photo's title ...",
      body: 'Description',
      bodyPlaceholder: 'Write a description ...',
    },
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
  media: {
    medium: {
      description: 'Description',
      title: 'Title',
    },
  },
  topics: {
    cTitle: 'Topics',
    mTitle: 'Topics',
    composer: {
      title: 'Title',
      titlePlaceholder: 'What topic are we talking about today?',
      body: 'Description',
      bodyPlaceholder: 'Start your conversation ...',
    },
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
    composer: {
      title: 'Title',
      titlePlaceholder: "Todo's title",
      body: 'Description',
      bodyPlaceholder: 'Write a description ...',
    },
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
    composer: {
      title: 'Title',
      titlePlaceholder: "Article's title ...",
      body: 'Description',
      bodyPlaceholder: 'Start writing ...',
      excerpt: 'Excerpt',
      excerptPlaceholder: 'Write an excerpt ...',
    },
    settings: {
      article: {
        add: 'Who can publish an article on this profile?',
        addcomment: 'Who can comment on articles?',
        edit: 'Who can edit an article on this profile?',
      },
    },
  },
  explore: {
    cTitle: 'Explore',
    mTitle: 'Explore',
  },
  socialgraph: {
    cTitle: 'Social Graph',
    mTitle: 'Social Graph',
    followers: 'Followers',
    leaders: 'Leaders',
    mutuals: 'Mutualls',
    blocked: 'Blocked',
  },
  hashtags: {
    cTitle: 'Hashtags',
    mTitle: 'Hashtags',
  },
  locations: {
    cTitle: 'Locations',
    mTitle: 'Locations',
    location: {
      name: 'Name',
      address: 'Address',
      city: 'City',
      province: 'Province',
      country: 'Country',
    },
  },
  search: {
    cTitle: 'Search',
    mTitle: 'Search',
  },
  taggables: {
    count: '{{count}} nodes',
  },
  commons: {
    all: 'All',
    following: 'Following',
    administering: 'Administering',
    readMore: 'Read more',
    close: 'Close',
    enabled: 'Enabled',
    sortBy: 'Sort by',
    sortByOptions: {
      element: 'Element',
      enabled: 'Enabled',
      name: 'Name',
      ordering: 'Ordering',
      type: 'Type',
    },
    filterByType: 'Filter by type',
    filterByOptions: {
      all: 'Show all',
      authentication: 'Authentication',
      connect: 'Connect',
      profile: 'Profile',
      user: 'User',
      storage: 'Storage',
      system: 'System',
    },
    viewAll: 'View all',
    posts: 'Posts',
    settings: 'Settings',
    ignore: 'Ignore',
    accept: 'Accpet',
  },
};
