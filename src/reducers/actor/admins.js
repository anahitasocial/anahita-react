import createReducer from '../create';
import DEFAULT_ENTITY from '../../proptypes/PersonDefault';

export default (namespace) => {
  return (state, action) => {
    return createReducer(namespace, DEFAULT_ENTITY)(state, action);
  };
};
