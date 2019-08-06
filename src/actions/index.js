import * as api from '../api';

import createAction from './create';
import app from './app';
import avatar from './avatar';
import comments from './comments';
import cover from './cover';
import is from './is';
import likes from './likes';
import node from './node';
import notifications from './notifications';
import password from './password';
import session from './session';
import signup from './signup';
import socialgraph from './socialgraph';
import stories from './stories';
import taggables from './taggable';

const articles = createAction('articles')(api.articles);
const groups = createAction('groups')(api.groups);
const hashtags = createAction('hashtags')(api.hashtags);
const locations = createAction('locations')(api.locations);
const notes = createAction('notes')(api.notes);
const people = createAction('people')(api.people);
const photos = createAction('photos')(api.photos);
const todos = createAction('todos')(api.todos);
const topics = createAction('topics')(api.topics);

export {
  app,
  articles,
  avatar,
  comments,
  cover,
  is,
  groups,
  hashtags,
  likes,
  locations,
  node,
  notes,
  notifications,
  password,
  people,
  photos,
  session,
  signup,
  socialgraph,
  stories,
  taggables,
  todos,
  topics,
};
