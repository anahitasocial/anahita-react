import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from './auth';
import peopleReducer from './people';

export default combineReducers({
  form: formReducer,
  authReducer,
  peopleReducer,
});
