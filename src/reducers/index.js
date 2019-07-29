import { combineReducers } from 'redux';

import app from './app';
import auth from './auth';
import avatar from './avatar';
import comments from './comments';
import cover from './cover';
import likes from './likes';
import locations from './locations';
import hashtags from './hashtags';
import node from './node';
import notifications from './notifications';
import person from './person';
import socialgraph from './socialgraph';
import stories from './stories';
import taggables from './taggables';

import createMediaReducer from './createMedia';
import createActorsReducer from './createActors';

// create actors reducers
const people = createActorsReducer('people');
const groups = createActorsReducer('groups');

// create media reducers
const notes = createMediaReducer('notes');
const topics = createMediaReducer('topics');
const todos = createMediaReducer('todos');
const photos = createMediaReducer('photos');
const articles = createMediaReducer('articles');

export default combineReducers({
  app,
  articles,
  auth,
  avatar,
  comments,
  cover,
  groups,
  likes,
  locations,
  hashtags,
  node,
  notes,
  notifications,
  people,
  person,
  photos,
  socialgraph,
  stories,
  taggables,
  topics,
  todos,
});
