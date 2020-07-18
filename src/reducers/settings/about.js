import createReducer from '../create';
import DEFAULT_ENTITY from '../../proptypes/settings/AboutDefault';

export default (state, action) => {
  return createReducer('settings_about', DEFAULT_ENTITY)(state, action);
};
