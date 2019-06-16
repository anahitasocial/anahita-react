import { combineReducers } from 'redux';

import actors from './actors';
import app from './app';
import auth from './auth';
import avatar from './avatar';
import comments from './comments';
import cover from './cover';
import likes from './likes';
import locations from './locations';
import hashtags from './hashtags';
import media from './media';
import node from './node';
import notifications from './notifications';
import people from './people';
import person from './person';
import socialgraph from './socialgraph';
import stories from './stories';
import taggables from './taggables';

export default combineReducers({
  actors,
  app,
  auth,
  avatar,
  comments,
  cover,
  likes,
  locations,
  hashtags,
  media,
  node,
  notifications,
  people,
  person,
  socialgraph,
  stories,
  taggables,
});
