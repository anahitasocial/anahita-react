import createReducer from '../create';
import DEFAULT_ENTITY from '../../proptypes/settings/AssignmentDefault';

export default (state, action) => {
  return createReducer('settings_assignments', DEFAULT_ENTITY)(state, action);
};
