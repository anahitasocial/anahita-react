import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { apiErrorMiddleware } from '../middleware';
import reducer from '../reducers';

const middleware = applyMiddleware(
  thunkMiddleware,
  apiErrorMiddleware,
);

const createFinalStore = compose(middleware)(createStore);

export default (initialState) => {
  return createFinalStore(reducer, initialState);
};
