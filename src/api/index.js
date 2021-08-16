import axios from 'axios';
import { singularize } from 'inflection';

import createApi from './create';
import createActor from './actor';
import createMedium from './medium';

import avatar from './avatar';
import comments from './comments';
import commentStatus from './commentsStatus';
import cover from './cover';
import is from './is';
import likes from './likes';
import node from './node';
import notifications from './notifications';
import password from './password';
import session from './session';
import settings from './settings';
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
}, (error) => { return Promise.reject(error); });

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
    'stories',
    'blogs',
  ],
};

const apis = {
  avatar,
  comments,
  commentStatus,
  cover,
  is,
  likes,
  node,
  notifications,
  password,
  session,
  settings,
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
    [singularize(ns)]: createMedium(ns),
  };
});

namespaces.tags.forEach((ns) => {
  apis[ns] = createApi(ns);
});

namespaces.nodes.forEach((ns) => {
  apis[ns] = createApi(ns);
});

export default apis;
