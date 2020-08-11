import createReducer from '../create';
import DEFAULT_ENTITY from '../../proptypes/settings/AppDefault';

export default (state, action) => {
  return createReducer('actor_permissions', DEFAULT_ENTITY)(state, action);
};
