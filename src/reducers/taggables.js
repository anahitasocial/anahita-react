import createReducer from './create';
import DEFAULT_NODE from '../proptypes/NodeDefault';

export default (state, action) => {
  return createReducer('taggables', DEFAULT_NODE)(state, action);
};
