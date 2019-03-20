import { combineReducers } from 'redux';

import actors from './actors';
import app from './app';
import auth from './auth';
import avatar from './avatar';
import likes from './likes';
import media from './media';
import people from './people';
import person from './person';
import socialgraph from './socialgraph';
import stories from './stories';

export default combineReducers({
  actors,
  app,
  auth,
  avatar,
  likes,
  media,
  people,
  person,
  socialgraph,
  stories,
});
