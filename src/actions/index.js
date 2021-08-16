import { singularize } from 'inflection';
import apis from '../api';

import createAction from './create';
import createGraphAction from './createGraph';
import createActorAdmins from './actor/admins';
import createActorFollowRequests from './actor/followrequests';
import app from './app';
import avatar from './avatar';
import commentsInline from './commentsInline';
import cover from './cover';
import likes from './likes';
import password from './password';
import session from './session';
import signup from './signup';
import socialgraph from './socialgraph';
import stories from './stories';
import taggables from './taggable';

const namespaces = {
  actors: [
    'groups',
    'people',
  ],
  media: [
    'articles',
    'documents',
    'notes',
    'photos',
    'todos',
    'topics',
  ],
  tags: [
    'hashtags',
    'locations',
  ],
  nodes: [
    'search',
    'notifications',
    'blogs',
  ],
};

const actions = {
  app,
  avatar,
  commentsInline,
  cover,
  likes,
  password,
  session,
  signup,
  socialgraph,
  stories,
  taggables,
};

namespaces.actors.forEach((namespace) => {
  const api = apis[namespace][singularize(namespace)];
  actions[namespace] = {
    ...createAction(namespace)(apis[namespace]),
    followRequests: createActorFollowRequests(namespace)(api.followrequests),
    settings: {
      admins: createActorAdmins(namespace)(api.admins),
      apps: createAction(`${namespace}_apps`)(api.apps),
      permissions: createAction(`${namespace}_permissions`)(api.permissions),
      privacy: createAction(`${namespace}_privacy`)(api.privacy),
    },
  };
});

namespaces.media.forEach((namespace) => {
  const api = apis[namespace][singularize(namespace)];
  actions[namespace] = {
    ...createAction(namespace)(apis[namespace]),
    likes: likes(namespace)(apis.likes),
    privacy: createAction(`${namespace}_privacy`)(api.privacy),
  };
});

namespaces.tags.forEach((namespace) => {
  actions[namespace] = createAction(namespace)(apis[namespace]);
});

namespaces.nodes.forEach((namespace) => {
  actions[namespace] = createAction(namespace)(apis[namespace]);
});

actions.comments = (namespace) => {
  return {
    ...createAction('comments')(apis.comments(namespace)),
    likes: likes('comments')(apis.likes),
  };
};

actions.commentStatus = (namespace) => {
  return createAction('commentStatus')(apis.commentStatus(namespace));
};

actions.locationsGraph = createGraphAction('locations')(apis.tagGraph);

actions.settings = {
  about: createAction('settings_about')(apis.settings.about),
  apps: createAction('settings_apps')(apis.settings.apps),
  assignments: createAction('settings_assignments')(apis.settings.assignments),
  configs: createAction('settings_configs')(apis.settings.configs),
  plugins: createAction('settings_plugins')(apis.settings.plugins),
};

export default actions;
