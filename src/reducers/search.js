import createReducer from './create';
import DEFAULT_NODE from '../proptypes/NodeDefault';

export default (state, action) => {
  return createReducer('search', DEFAULT_NODE)(state, action);
};
