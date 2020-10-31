import createReducer from './create';
import NODE_DEFAULT from '../proptypes/NodeDefault';

export default (namespace) => {
  return (state, action) => {
    return createReducer(namespace, NODE_DEFAULT)(state, action);
  };
};
