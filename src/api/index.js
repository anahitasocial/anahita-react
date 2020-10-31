import axios from 'axios';
import createApi from './create';
import createActor from './actor';

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
const documents = createApi('documents');
const groups = {
  ...createApi('groups'),
  group: createActor('groups'),
};
const hashtags = createApi('hashtags');
const locations = createApi('locations');
const notes = createApi('notes');
const people = {
  ...createApi('people'),
  person: createActor('people'),
};
const photos = createApi('photos');
const search = createApi('search');
const stories = createApi('stories');
const todos = createApi('todos');
const topics = createApi('topics');

export {
  articles,
  documents,
  avatar,
  comments,
  commentStatus,
  cover,
  groups,
  hashtags,
  is,
  likes,
  locations,
  node,
  notes,
  notifications,
  password,
  people,
  photos,
  search,
  session,
  settings,
  signup,
  socialgraph,
  stories,
  taggables,
  tagGraph,
  todos,
  topics,
};
