import { singularize } from 'inflection';
import apis from '../api';

import createAction from './create';
import createGraphAction from './createGraph';
import createActorFollowRequests from './actor/followrequests';
import createActorAdminsAction from './actor/admins';
import app from './app';
import commentsInline from './commentsInline';
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
    'blogs',
  ],
};

const actions = {
  app,
  commentsInline,
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
      access: createAction(`${namespace}_access`)(api.access),
      admins: createActorAdminsAction(`${namespace}_admins`)(api.admins),
      apps: createAction(`${namespace}_apps`)(api.apps),
    },
  };
});

namespaces.media.forEach((namespace) => {
  const api = apis[namespace][singularize(namespace)];
  actions[namespace] = {
    ...createAction(namespace)(apis[namespace]),
    likes: likes(namespace)(apis.likes),
    access: createAction(`${namespace}_access`)(api.access),
  };
});

namespaces.tags.forEach((namespace) => {
  actions[namespace] = createAction(namespace)(apis[namespace]);
});

namespaces.nodes.forEach((namespace) => {
  actions[namespace] = createAction(namespace)(apis[namespace]);
});

actions.comments = {
  ...createAction('comments')(apis.comments),
  likes: likes('comments')(apis.likes),
};

actions.commentStatus = (namespace) => {
  return createAction('commentStatus')(apis.commentStatus(namespace));
};

actions.feed = {
  leaders: createAction('feed_leaders')(apis.feed.leaders),
  actor: createAction('feed_actor')(apis.feed.actor),
};

actions.locationsGraph = createGraphAction('locations')(apis.tagGraph);

actions.notifications = {
  ...createAction('notifications')(apis.notifications),
  subs: createAction('notifications_sub')(apis.notificationsSub),
};

export default actions;
