import { combineReducers } from 'redux';

import actors from './actors';
import app from './app';
import auth from './auth';
import avatar from './avatar';
import cover from './cover';
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
  cover,
  likes,
  media,
  people,
  person,
  socialgraph,
  stories,
});
