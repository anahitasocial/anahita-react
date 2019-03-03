import { combineReducers } from 'redux';

import app from './app';
import auth from './auth';
import actors from './actors';
import likes from './likes';
import media from './media';
import people from './people';
import person from './person';
import stories from './stories';

export default combineReducers({
  app,
  auth,
  actors,
  likes,
  media,
  people,
  person,
  stories,
});
