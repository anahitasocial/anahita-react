import createReducer from '../create';
import DEFAULT_ENTITY from '../../proptypes/settings/ConfigsDefault';

export default (state, action) => {
  return createReducer('settings_configs', DEFAULT_ENTITY)(state, action);
};
