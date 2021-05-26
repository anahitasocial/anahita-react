import { singularize } from 'inflection';
import apis from '../api';

import createAction from './create';
import createGraphAction from './createGraph';
import createActorAdmins from './actor/admins';
import createActorFollowRequests from './actor/followrequests';
import app from './app';
import avatar from './avatar';
import cover from './cover';
import commentsInline from './commentsInline';
import likes from './likes';
import notifications from './notifications';
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
  ],
};

const actions = {
  app,
  avatar,
  cover,
  commentsInline,
  likes,
  notifications,
  password,
  session,
  signup,
  socialgraph,
  stories,
  taggables,
};

namespaces.actors.forEach((ns) => {
  const api = apis[ns][singularize(ns)];
  actions[ns] = {
    ...createAction(ns)(apis[ns]),
    followRequests: createActorFollowRequests(ns)(api.followrequests),
    settings: {
      admins: createActorAdmins(ns)(api.admins),
      apps: createAction(`${ns}_apps`)(api.apps),
      permissions: createAction(`${ns}_permissions`)(api.permissions),
      privacy: createAction(`${ns}_privacy`)(api.privacy),
    },
  };
});

namespaces.media.forEach((ns) => {
  const api = apis[ns][singularize(ns)];
  actions[ns] = {
    ...createAction(ns)(apis[ns]),
    likes: likes.nodes(ns)(apis[ns]),
    privacy: createAction(`${ns}_privacy`)(api.privacy),
  };
});

namespaces.tags.forEach((ns) => {
  actions[ns] = createAction(ns)(apis[ns]);
});

namespaces.nodes.forEach((ns) => {
  actions[ns] = createAction(ns)(apis[ns]);
});

actions.comments = (namespace) => {
  return {
    ...createAction('comments')(apis.comments(namespace)),
    likes: likes.comments(apis.likes),
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
