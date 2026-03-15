/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import axios from 'axios';
import { singularize } from 'inflection';
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
import inbounds from './inbounds';
import tagGraph from './tag_graph';
import token from './token';
import api from '../utils/api';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.maxRedirects = 0;

const convertFormDataKey = (key) => {
  // Convert camelCase parts while preserving bracket structure
  return key.replace(/[^[\]]+/g, (match) => {
    return _.snakeCase(match);
  });
};

// Attach access token to every request
axios.interceptors.request.use((config) => {
  const t = sessionStorage.getItem('access_token');
  console.debug('=== interceptor token:', t ? t.substring(0, 20) : 'null', 'url:', config.url);
  if (t) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${t}`,
      },
    };
  }
  return config;
});

// Handle 401 responses with token refresh
let isRefreshing = false;
let refreshQueue = [];

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then((t) => {
        originalRequest.headers.Authorization = `Bearer ${t}`;
        return axios(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await session.refresh(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = res.data;

      sessionStorage.setItem('access_token', accessToken);
      sessionStorage.setItem('refresh_token', newRefreshToken);

      refreshQueue.forEach((req) => {
        return req.resolve(accessToken);
      });
      refreshQueue = [];

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axios(originalRequest);
    } catch (refreshError) {
      refreshQueue.forEach((req) => {
        return req.reject(refreshError);
      });
      refreshQueue = [];
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      localStorage.removeItem('viewer');
      window.location.href = '/';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

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
    if (error.response.data && error.config.baseURL === axios.defaults.baseURL) {
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
  inbounds,
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
