import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routeReducer } from 'redux-simple-router';

import authReducer from './auth';
import alertsReducer from './alerts';

export default combineReducers({
  routing: routeReducer,
  form: formReducer,
  auth: authReducer,
  alerts: alertsReducer
});
