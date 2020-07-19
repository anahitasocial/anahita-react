import createReducer from '../create';
import DEFAULT_ENTITY from '../../proptypes/settings/AppDefault';

export default (state, action) => {
  return createReducer('settings_apps', DEFAULT_ENTITY)(state, action);
};
