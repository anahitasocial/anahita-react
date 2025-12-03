import axios from 'axios';
import { singularize } from 'inflection';
import _ from 'lodash';
import createApi from './create';
import createActor from './actor';

import avatar from './avatar';
import comments from './comments';
import commentStatus from './commentsStatus';
import cover from './cover';
import feed from './feed';
import hashtags from './hashtags';
import is from './is';
import likes from './likes';
import locations from './locations';
import node from './node';
import notifications from './notifications';
import notificationsSub from './notifications/sub';
import password from './password';
import repost from './feed/repost';
import session from './session';
import signup from './signup';
import socialgraph from './socialgraph';
import taggables from './taggables';
import tagGraph from './tag_graph';
import token from './token';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const headers = { ...config.headers };
  return {
    ...config,
    ...{ headers },
  };
}, (error) => {
  return Promise.reject(error);
});

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
  nodes: [
    'search',
    'stories',
    'blogs',
  ],
};

const apis = {
  avatar,
  comments,
  commentStatus,
  cover,
  feed_leaders: feed.leaders,
  feed_actor: feed.actor,
  hashtags,
  is,
  likes,
  locations,
  node,
  notifications,
  notificationsSub,
  password,
  repost,
  session,
  signup,
  socialgraph,
  taggables,
  tagGraph,
  token,
};

namespaces.actors.forEach((ns) => {
  apis[ns] = {
    ...createApi(ns),
    [singularize(ns)]: createActor(ns),
  };
});

namespaces.media.forEach((ns) => {
  apis[ns] = {
    ...createApi(ns),
    [singularize(ns)]: createApi(ns),
  };
});

namespaces.nodes.forEach((ns) => {
  apis[ns] = createApi(ns);
});

export default apis;
