import createReducer from '../create';
import DEFAULT_ENTITY from '../../proptypes/actor/PrivacyDefault';

export default (namespace) => {
  return (state, action) => {
    return createReducer(namespace, DEFAULT_ENTITY)(state, action);
  };
};
