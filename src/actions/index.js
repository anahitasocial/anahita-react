import * as api from '../api';

import createAction from './create';
import actor from './actor';
import app from './app';
import auth from './auth';
import avatar from './avatar';
import comments from './comments';
import cover from './cover';
import likes from './likes';
import media from './media';
import node from './node';
import notifications from './notifications';
import person from './person';
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
  actor,
  app,
  articles,
  auth,
  avatar,
  comments,
  cover,
  groups,
  hashtags,
  likes,
  locations,
  media,
  node,
  notes,
  notifications,
  people,
  person,
  photos,
  socialgraph,
  stories,
  taggables,
  todos,
  topics,
};
