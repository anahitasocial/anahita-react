import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { apiErrorMiddleware } from '../middleware';
import reducer from '../reducers';
import DevTools from '../containers/DevTools';

const loggerMiddleware = createLogger();

const middleware = applyMiddleware(
  thunkMiddleware,
  apiErrorMiddleware,
  loggerMiddleware,
);

const createFinalStore = compose(
  middleware,
  DevTools.instrument(),
)(createStore);

export default (initialState) => {
  return createFinalStore(reducer, initialState);
};
