import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from './auth';
import actorsReducer from './actors';
import actorReducer from './actor';
import peopleReducer from './people';
import personReducer from './person';
import socialgraphReducer from './socialgraph';

export default combineReducers({
  formReducer,
  authReducer,
  actorsReducer,
  actorReducer,
  peopleReducer,
  personReducer,
  socialgraphReducer,
});
