import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// Authentication
import authReducer from './auth';

// Actors
import actorsReducer from './actors';
import actorReducer from './actor';

// People
import peopleReducer from './people';

// Social Graph
import followReducer from './follow';
import blockReducer from './block';

export default combineReducers({
  formReducer,
  authReducer,
  actorsReducer,
  actorReducer,
  peopleReducer,
  followReducer,
  blockReducer,
});
