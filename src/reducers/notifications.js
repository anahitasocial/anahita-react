import createReducer from './create';
import DEFAULT_NOTIFICATION from '../proptypes/NotificationDefault';

export default (state, action) => {
  return createReducer('notifications', DEFAULT_NOTIFICATION)(state, action);
};
