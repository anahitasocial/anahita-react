import axios from 'axios';
import createApi from './create';

import actors from './actors';
import avatar from './avatar';
import auth from './auth';
import comments from './comments';
import cover from './cover';
import likes from './likes';
import media from './media';
import node from './node';
import notifications from './notifications';
import person from './person';
import socialgraph from './socialgraph';
import taggables from './taggables';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const headers = { ...config.headers };
  return {
    ...config,
    ...{ headers },
  };
}, (error) => { return Promise.reject(error); });

const groups = createApi('groups');
const hashtags = createApi('hashtags');
const locations = createApi('locations');
const people = createApi('people');
const stories = createApi('stories');

export {
  actors,
  avatar,
  auth,
  comments,
  cover,
  groups,
  hashtags,
  likes,
  locations,
  media,
  node,
  notifications,
  person,
  people,
  socialgraph,
  stories,
  taggables,
};
