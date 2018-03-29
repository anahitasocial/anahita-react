import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// Authentication
import authReducer from './auth';

// Actors
import actorsReducer from './actors';
import actorReducer from './actor';

// People
import peopleReducer from './people';
import personReducer from './person';

export default combineReducers({
  formReducer,
  authReducer,
  actorsReducer,
  actorReducer,
  peopleReducer,
  personReducer,
});
