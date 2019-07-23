import {
  groups as groupsApi,
  hashtags as hashtagsApi,
  locations as locationsApi,
  people as peopleApi,
} from '../api';

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

const groups = createAction('groups')(groupsApi);
const hashtags = createAction('hashtags')(hashtagsApi);
const locations = createAction('locations')(locationsApi);
const people = createAction('people')(peopleApi);

export {
  actor,
  app,
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
  notifications,
  people,
  person,
  socialgraph,
  stories,
  taggables,
};
