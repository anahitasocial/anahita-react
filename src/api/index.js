import axios from 'axios';
import createApi from './create';

import actors from './actors';
import avatar from './avatar';
import auth from './auth';
import comments from './comments';
import cover from './cover';
import likes from './likes';
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

const articles = createApi('articles');
const groups = createApi('groups');
const hashtags = createApi('hashtags');
const locations = createApi('locations');
const notes = createApi('notes');
const people = createApi('people');
const photos = createApi('photos');
const stories = createApi('stories');
const todos = createApi('todos');
const topics = createApi('topics');

export {
  actors,
  articles,
  avatar,
  auth,
  comments,
  cover,
  groups,
  hashtags,
  likes,
  locations,
  node,
  notes,
  notifications,
  person,
  people,
  photos,
  socialgraph,
  stories,
  taggables,
  todos,
  topics,
};
