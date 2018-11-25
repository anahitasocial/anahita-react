import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// Authentication
import authReducer from './auth';

// Actors
import actorsReducer from './actors';
import actorReducer from './actor';

// Media
import mediaReducer from './media';

// People
import peopleReducer from './people';
import personReducer from './person';

// Stories
import storiesReducer from './stories';

export default combineReducers({
  formReducer,
  authReducer,
  actorsReducer,
  actorReducer,
  mediaReducer,
  peopleReducer,
  personReducer,
  storiesReducer,
});
