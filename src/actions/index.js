import * as api from '../api';

import createAction from './create';
import app from './app';
import avatar from './avatar';
import inlineComments from './inline_comments';
import cover from './cover';
import likes from './likes';
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

const comments = (namespace) => {
  return createAction('comments')(api.comments(namespace));
};

const commentStatus = (namespace) => {
  return createAction('commentStatus')(api.commentStatus(namespace));
};

export {
  app,
  articles,
  avatar,
  comments,
  commentStatus,
  cover,
  inlineComments,
  groups,
  hashtags,
  likes,
  locations,
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
