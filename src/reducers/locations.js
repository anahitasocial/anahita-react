import createReducer from './create';
import DEFAULT_LOCATION from '../proptypes/LocationDefault';

export default (state, action) => {
  return createReducer('locations', DEFAULT_LOCATION)(state, action);
};
