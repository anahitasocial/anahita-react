import createReducer from '../create';
import DEFAULT_ENTITY from '../../proptypes/settings/PluginDefault';

export default (state, action) => {
  return createReducer('settings_plugins', DEFAULT_ENTITY)(state, action);
};
