import * as api from '../api';

import createAction from './create';
import createActorAdmins from './actor/admins';
import createActorFollowRequests from './actor/followrequests';
import createLikes from './createLikes';
import app from './app';
import avatar from './avatar';
import cover from './cover';
import commentsInline from './commentsInline';
import notifications from './notifications';
import password from './password';
import session from './session';
import signup from './signup';
import socialgraph from './socialgraph';
import stories from './stories';
import taggables from './taggable';

const articles = {
  ...createAction('articles')(api.articles),
  likes: createLikes('articles')(api.likes),
};

const documents = {
  ...createAction('documents')(api.documents),
  likes: createLikes('documents')(api.likes),
};

const groups = {
  ...createAction('groups')(api.groups),
  followRequests: createActorFollowRequests('groups')(api.groups.group.followrequests),
  settings: {
    admins: createActorAdmins('groups')(api.groups.group.admins),
    apps: createAction('groups_apps')(api.groups.group.apps),
    permissions: createAction('groups_permissions')(api.groups.group.permissions),
    privacy: createAction('groups_privacy')(api.groups.group.privacy),
  },
};
const hashtags = createAction('hashtags')(api.hashtags);
const locations = createAction('locations')(api.locations);

const notes = {
  ...createAction('notes')(api.notes),
  likes: createLikes('notes')(api.likes),
};

const people = {
  ...createAction('people')(api.people),
  followRequests: createActorFollowRequests('people')(api.people.person.followrequests),
  settings: {
    apps: createAction('people_apps')(api.people.person.apps),
    permissions: createAction('people_permissions')(api.people.person.permissions),
    privacy: createAction('people_privacy')(api.people.person.privacy),
  },
};

const photos = {
  ...createAction('photos')(api.photos),
  likes: createLikes('photos')(api.likes),
};

const settings = {
  about: createAction('settings_about')(api.settings.about),
  apps: createAction('settings_apps')(api.settings.apps),
  assignments: createAction('settings_assignments')(api.settings.assignments),
  configs: createAction('settings_configs')(api.settings.configs),
  plugins: createAction('settings_plugins')(api.settings.plugins),
};
const search = createAction('search')(api.search);

const todos = {
  ...createAction('todos')(api.todos),
  likes: createLikes('todos')(api.likes),
};

const topics = {
  ...createAction('topics')(api.topics),
  likes: createLikes('topics')(api.likes),
};

const comments = (namespace) => {
  return {
    ...createAction('comments')(api.comments(namespace)),
    likes: createLikes('comments')(api.likes),
  };
};

const commentStatus = (namespace) => {
  return createAction('commentStatus')(api.commentStatus(namespace));
};

const locationsGraph = (taggable) => {
  return createAction('locationsGraph')(api.tagGraph(taggable));
};

export {
  app,
  articles,
  documents,
  avatar,
  comments,
  commentsInline,
  commentStatus,
  cover,
  groups,
  hashtags,
  locations,
  locationsGraph,
  notes,
  notifications,
  password,
  people,
  photos,
  search,
  settings,
  session,
  signup,
  socialgraph,
  stories,
  taggables,
  todos,
  topics,
};
