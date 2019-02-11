import { combineReducers } from 'redux';

import app from './app';
import auth from './auth';
import actors from './actors';
import actor from './actor';
import media from './media';
import people from './people';
import person from './person';
import stories from './stories';

export default combineReducers({
  app,
  auth,
  actors,
  actor,
  media,
  people,
  person,
  stories,
});
