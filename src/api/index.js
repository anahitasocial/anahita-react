/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import axios from 'axios';
import { singularize } from 'inflection';
import createApi from './create';
import createActor from './actor';

import authlogs from './authlogs';
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
import oauthClients from './oauthClients';
import password from './password';
import repost from './feed/repost';
import session from './session';
import signup from './signup';
import socialgraph from './socialgraph';
import inbounds from './inbounds';
import tagGraph from './tag_graph';
import token from './token';
import totp from './totp';
import api from '../utils/api';
import webauthn from './webauthn';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.maxRedirects = 0;

const convertFormDataKey = (key) => {
  // Convert camelCase parts while preserving bracket structure
  return key.replace(/[^[\]]+/g, (match) => {
    return _.snakeCase(match);
  });
};

// Snake case request interceptor (keep)
axios.interceptors.request.use((config) => {
  let { data } = config;

  if (data instanceof FormData) {
    const newFormData = new FormData();
    Array.from(data.entries()).forEach(([key, value]) => {
      newFormData.append(convertFormDataKey(key), value);
    });
    data = newFormData;
  } else if (data && typeof data === 'object') {
    data = api.snakeCaseKeys(data);
  }

  return { ...config, data };
});

// Camel case response interceptor (keep)
axios.interceptors.response.use(
  (response) => {
    if (response.data && response.config.baseURL === axios.defaults.baseURL) {
      return {
        ...response,
        data: api.camelCaseKeys(response.data),
      };
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.data && error.config.baseURL === axios.defaults.baseURL) {
      const updatedError = { ...error };
      updatedError.response = {
        ...error.response,
        data: api.camelCaseKeys(error.response.data),
      };
      return Promise.reject(updatedError);
    }
    return Promise.reject(error);
  },
);

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
    'topics',
  ],
  nodes: [
    'search',
    'stories',
    'blogs',
  ],
};

const apis = {
  authlogs,
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
  oauthClients,
  password,
  repost,
  session,
  signup,
  socialgraph,
  inbounds,
  tagGraph,
  token,
  totp,
  webauthn,
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
